import React from 'react'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast';


const Banner = () => {

  const {isOwner, setIsOwner, user, navigate, setShowLogin, axios} = useAppContext();

  const changeRole = async ()=>{
          try {
              const { data } = await axios.post('/api/owner/change-role')
              if (data.success) {
                  setIsOwner(true)
                  toast.success("Account upgraded! You can now list your cars.")
              }else{
                  toast.error(data.message)
              }
          } catch (error) {
              toast.error(error.message)
          }
      }

  const navigateToListCar = async () => {
  if (!user) {
    setShowLogin(true);
    toast.error("Please login to list your car");
    return; // STOP execution here
  }

  if (user && !isOwner) {
    await changeRole(); // Wait for the API to finish and update the role and then naviagate to the add car page
    navigate('/owner'); // Navigate to the dashboard after role change
    return;
  }

  // If already an owner, just go to the page
  navigate('/owner/add-car');
};
  return (
    <div className='flex flex-col md:flex-row md:items-start items-center justify-between px-8 md:pl-14 pt-10 bg-linear-to-r from-[#0558FE] to-[#A9CFFF] max-w-6xl mx-3 md:mx-auto rounded-2xl overflow-hidden'>

        <div className='text-white'>
            <h2 className='text-3xl font-medium'>Do You Own a Luxury Car?</h2>
            <p className='mt-2'>Monetize your vehicle effortlessly by listing it on CarRental.</p>
            <p className='max-w-130'>We take care of insurance, driver verification and secure payments - so you can earn passive income, stress-free.</p>
            
            <button onClick={navigateToListCar} className='px-6 py-2 bg-white hover:bg-slate-100 transition-all text-primary rounded-lg text-sm mt-4 cursor-pointer'>
                List your car
            </button>
        </div>

        <img src={assets.banner_car_image} alt="car" className='max-h-45 mt-10'/>

    </div>
  )
}

export default Banner