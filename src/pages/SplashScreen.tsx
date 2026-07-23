import SplashscreenLogo from '@/assets/SplashScreen.png'

function SplashScreen() { 
    return (
        <>
        <div className='bg-[var(--bg-primary)] flex flex-col text-center min-h-screen justify-center items-center relative'>
            {/* Subtle texture overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-30"
                style={{
                    backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(42, 89, 58, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(63, 120, 153, 0.05) 0%, transparent 50%)'
                }}
            />
            
            <div className="relative z-10">
                <img src={SplashscreenLogo} alt="Splash screen" className='mb-5'/>
                <h2 className='text-[var(--text-primary)] font-cinzel font-bold text-2xl mb-2'>Boredom Buster</h2>
                <p className='text-[var(--text-secondary)] text-sm mb-1'>Curing boredom, one task at a</p>
                <p className='text-[var(--text-secondary)] text-sm mb-8'>time.</p>

                <div className='flex flex-col items-center w-full text-center'>
                    <div className='w-10 h-10 mb-3 rounded-full border-2 border-[var(--vitality)] warm-glow-vitality'></div>
                    <p className='font-cinzel font-bold text-sm text-[var(--text-muted)]'>INITIALIZING...</p>
                    <p className='text-xs mt-5 text-[var(--text-muted)]'>Powered by Soft Mode Intelligence</p>
                </div>
            </div>
        </div> 
        </>
    )
}

export default SplashScreen;
