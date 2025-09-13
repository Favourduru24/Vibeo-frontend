import VideoDetail from '@/section/VideoDetail'

const page = async ({params, searchParams}) => {
   
    const {id} = await params

    const searchParam = await searchParams

   const category = (searchParam?.category) || ''

  return (
     <VideoDetail id={id} category={category}/>
  )
}

export default page