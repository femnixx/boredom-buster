function FloatingLoginBanner() { 
    return (
        <>
        <div className="rpg-panel p-4 flex items-start space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--vitality)] to-[var(--intellect)] flex items-center justify-center flex-shrink-0 warm-glow-vitality">
                <svg className="w-5 h-5 text-[var(--bg-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
            </div>
            <div>
                <p className="text-xs font-cinzel font-semibold text-[var(--vitality)]">NEW ACHIEVEMENT</p>
                     <p className="font-cinzel font-semibold text-[var(--text-primary)]">Master of Focus</p>
                <p className="text-sm text-[var(--text-muted)]">Completed 5 tasks in under 2 hours today!</p>
            </div>
        </div>
        </>
    )
}

export default FloatingLoginBanner;