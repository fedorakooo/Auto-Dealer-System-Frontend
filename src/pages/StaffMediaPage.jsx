import { useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/features/auth/hooks/useAuth.js'
import {
  deleteMedia,
  fetchMedia,
  mediaFileUrl,
  uploadMedia,
} from '@/features/media/mediaService.js'
import { fetchModels } from '@/features/models/modelService.js'
import { modelsResponseSchema } from '@/features/models/schemas.js'
import { fetchVehicles } from '@/features/vehicles/vehicleService.js'
import { vehiclesResponseSchema } from '@/features/vehicles/schemas.js'
import { parseApiError } from '@/services/api'
import { resolveMediaUrl } from '@/lib/mediaUrl.js'
import { Alert } from '@/shared/ui/Alert.jsx'
import { Button } from '@/shared/ui/Button.jsx'
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog.jsx'
import { EmptyState } from '@/shared/ui/EmptyState.jsx'
import { PageHeader } from '@/shared/ui/PageHeader.jsx'
import { Panel } from '@/shared/ui/Panel.jsx'
import { Select } from '@/shared/ui/Select.jsx'
import { Spinner } from '@/shared/ui/Spinner.jsx'

const KIND_OPTIONS = [
  { value: 'model', label: 'Модель — внешний вид' },
  { value: 'vehicle', label: 'Автомобиль — конкретный экземпляр' },
]

const ACCEPTED_TYPES = 'image/jpeg,image/png,image/webp'

export function StaffMediaPage() {
  const { api } = useAuth()
  const queryClient = useQueryClient()
  const fileInput = useRef(null)
  const [kind, setKind] = useState('model')
  const [ownerId, setOwnerId] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)

  const ownersQuery = useQuery({
    queryKey: ['media-owners', kind],
    queryFn: async () => {
      if (kind === 'model') {
        const raw = await fetchModels(api, { page: 1, limit: 100 })
        return modelsResponseSchema.parse(raw).models.map((m) => ({ id: m.id, label: m.name }))
      }
      const raw = await fetchVehicles(api, { page: 1, limit: 100 })
      return vehiclesResponseSchema.parse(raw).vehicles.map((v) => ({
        id: v.id,
        label: `${v.model_name ?? 'Автомобиль'} · ${v.production_year} · ${v.exterior_color} · ${v.vin}`,
      }))
    },
  })

  const mediaQuery = useQuery({
    queryKey: ['media', kind, ownerId],
    queryFn: () => fetchMedia(api, kind, ownerId),
    enabled: Boolean(ownerId),
  })

  const refreshMedia = () => {
    queryClient.invalidateQueries({ queryKey: ['media', kind, ownerId] })
    queryClient.invalidateQueries({ queryKey: kind === 'model' ? ['models'] : ['vehicles'] })
    queryClient.invalidateQueries({ queryKey: ['vehicles'] })
  }

  const uploadMutation = useMutation({
    mutationFn: (file) => uploadMedia(api, kind, ownerId, file),
    onSuccess: () => {
      if (fileInput.current) fileInput.current.value = ''
      refreshMedia()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (mediaId) => deleteMedia(api, kind, mediaId),
    onSuccess: () => {
      setDeleteTarget(null)
      refreshMedia()
    },
    onError: () => setDeleteTarget(null),
  })

  const changeKind = (nextKind) => {
    setKind(nextKind)
    setOwnerId('')
  }

  const media = mediaQuery.data ?? []
  const imageMedia = media.filter((item) => item.media_type === 'image')

  return (
    <div>
      <PageHeader
        kicker="Каталог"
        title="Фотографии"
        subtitle="У модели хранится её внешний вид, у автомобиля — фотографии конкретного экземпляра. Если у автомобиля нет своих фото, в каталоге показывается внешний вид модели."
      />

      <Panel title="Выбор объекта" className="mb-6">
        <div className="grid gap-x-4 md:grid-cols-2">
          <Select
            id="media-kind"
            label="Что фотографируем"
            value={kind}
            onChange={(event) => changeKind(event.target.value)}
          >
            {KIND_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
          <Select
            id="media-owner"
            label={kind === 'model' ? 'Модель' : 'Автомобиль'}
            value={ownerId}
            onChange={(event) => setOwnerId(event.target.value)}
          >
            <option value="">Выберите…</option>
            {ownersQuery.data?.map((owner) => (
              <option key={owner.id} value={owner.id}>
                {owner.label}
              </option>
            ))}
          </Select>
        </div>
        {ownersQuery.isError ? (
          <Alert variant="danger">{parseApiError(ownersQuery.error).message}</Alert>
        ) : null}
      </Panel>

      {ownerId ? (
        <Panel
          title="Загруженные фото"
          description="Допустимы JPG, PNG и WEBP до 10 МБ."
          actions={
            <>
              <input
                ref={fileInput}
                id="media-file"
                type="file"
                accept={ACCEPTED_TYPES}
                className="sr-only"
                onChange={(event) => {
                  const file = event.target.files?.[0]
                  if (file) uploadMutation.mutate(file)
                }}
              />
              <Button loading={uploadMutation.isPending} onClick={() => fileInput.current?.click()}>
                Загрузить фото
              </Button>
            </>
          }
        >
          {uploadMutation.isError ? (
            <Alert variant="danger">{parseApiError(uploadMutation.error).message}</Alert>
          ) : null}
          {deleteMutation.isError ? (
            <Alert variant="danger">{parseApiError(deleteMutation.error).message}</Alert>
          ) : null}
          {mediaQuery.isLoading ? <Spinner /> : null}
          {mediaQuery.isError ? (
            <Alert variant="danger">{parseApiError(mediaQuery.error).message}</Alert>
          ) : null}
          {mediaQuery.isSuccess && !imageMedia.length ? (
            <EmptyState
              icon="box"
              title="Фотографий пока нет"
              description="Загрузите первое фото — оно появится в каталоге."
            />
          ) : null}
          {imageMedia.length ? (
            <ul className="m-0 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
              {imageMedia.map((item) => (
                <li
                  key={item.id}
                  className="overflow-hidden rounded-lg border border-[var(--color-border)]"
                >
                  <img
                    src={resolveMediaUrl(mediaFileUrl(kind, item.id))}
                    alt={item.description || ''}
                    className="aspect-[4/3] w-full object-cover"
                    loading="lazy"
                  />
                  <div className="flex items-center justify-between gap-2 p-3">
                    <span className="truncate text-xs text-[var(--color-text-muted)]">
                      №{item.sort_order}
                    </span>
                    <Button variant="secondary" size="sm" onClick={() => setDeleteTarget(item.id)}>
                      Удалить
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          ) : null}
        </Panel>
      ) : (
        <EmptyState
          icon="search"
          title="Выберите объект"
          description={`Выберите ${kind === 'model' ? 'модель' : 'автомобиль'}, чтобы управлять фотографиями.`}
        />
      )}

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Удалить фото?"
        description="Фотография будет удалена из хранилища без возможности восстановления. Удаление доступно администраторам."
        confirmLabel="Удалить"
        destructive
        loading={deleteMutation.isPending}
        onConfirm={() => deleteMutation.mutate(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
