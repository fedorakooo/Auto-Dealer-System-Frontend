const benefits = [
  {
    number: '01',
    title: 'Удобный подбор',
    text: 'Фильтры по модели, цене и характеристикам без лишних шагов.',
  },
  {
    number: '02',
    title: 'Запись онлайн',
    text: 'Планируйте тест-драйв и сервисный визит в личном кабинете.',
  },
  {
    number: '03',
    title: 'Всё в одном месте',
    text: 'Каталог, дилерские центры, заказы и обслуживание в одном интерфейсе.',
  },
]

export function HomeIntro() {
  return (
    <section
      className="border-b border-[var(--color-border)] bg-[var(--color-surface)] py-14 sm:py-16"
      aria-labelledby="benefits-title"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_2.2fr] lg:items-start">
          <div>
            <p className="mb-3 text-xs font-semibold tracking-[0.22em] text-[var(--color-accent)] uppercase">
              Продумано для вас
            </p>
            <h2
              id="benefits-title"
              className="max-w-xs text-2xl tracking-[-0.025em] text-[var(--color-text)] sm:text-3xl"
            >
              От выбора до сервисного визита
            </h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            {benefits.map((benefit) => (
              <article
                key={benefit.number}
                className="border-l-2 border-[var(--color-border)] pl-5 transition-colors hover:border-[var(--color-accent)]"
              >
                <span className="text-xs font-semibold tracking-[0.16em] text-[var(--color-accent)]">
                  {benefit.number}
                </span>
                <h3 className="mt-3 mb-2 text-base text-[var(--color-text)]">{benefit.title}</h3>
                <p className="mb-0 text-sm leading-6 text-[var(--color-text-muted)]">
                  {benefit.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
