import { describe, it, expect } from 'vitest'
import { getModelPhotos, getVehiclePhotos } from '@/lib/photos.js'

describe('getVehiclePhotos', () => {
  it('prefers the vehicle photo over the model photo', () => {
    const photos = getVehiclePhotos({
      images: ['https://cdn.test/car.jpg'],
      model_images: ['https://cdn.test/model.jpg'],
    })
    expect(photos.cover).toBe('https://cdn.test/car.jpg')
    expect(photos.coverIsModelPhoto).toBe(false)
  })

  it('falls back to the model photo when the vehicle has none', () => {
    const photos = getVehiclePhotos({ images: null, model_images: ['https://cdn.test/model.jpg'] })
    expect(photos.cover).toBe('https://cdn.test/model.jpg')
    expect(photos.coverIsModelPhoto).toBe(true)
  })

  it('returns no cover when there are no photos at all', () => {
    const photos = getVehiclePhotos({})
    expect(photos.cover).toBeNull()
    expect(photos.own).toEqual([])
  })
})

describe('getModelPhotos', () => {
  it('returns an empty list for a model without images', () => {
    expect(getModelPhotos({ images: null })).toEqual([])
  })
})
