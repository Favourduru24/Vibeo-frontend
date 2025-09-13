import RecordDetail from '@/section/RecordDetails'

const page = async ({params}) => {
   
   const {id} = await params
  return (
     <RecordDetail id={id}/>
  )
}

export default page