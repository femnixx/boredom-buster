import SplashscreenLogo from '@/assets/SplashScreen.png'

function SplashScreen() { 
    return (
        <>
        <div className=' bg-[#F9F9FF] flex flex-col text-center min-h-screen justify-center items-center'>
            <img src={SplashscreenLogo} alt="Splash screen" className='mb-5'/>
            <h2 className='text-[#4648D4] font-bold text-xl'>Boredom Buster</h2>
            <p className='text-xs'>Curing boredom, one task at a</p>
            <p className='text-xs'>time.</p>

            <div className='mt-auto flex flex-col items-center w-full text-center mb-10'>
                <div className='border-3 mb-2 rounded-full border-[#6063EE] w-10'></div>
                <p className='font-bold text-sm text-gray-400'>INITIALIZING...</p>
                <p className='text-xs mt-5 text-gray-400'>Powered by Soft Mode Intelligence</p>
            </div>
        </div> 
        </>
    )
}

export default SplashScreen;