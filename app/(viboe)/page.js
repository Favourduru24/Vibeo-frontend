import Category from '@/components/Category';
import Videos from '@/section/Videos';

const Page = async (props) => {
   
   const searchParams = await props.searchParams

   const category = (searchParams?.category) || ''

  return (
    <div>
      <Category/> 
       <Videos category={category}/>
    </div>
  );
};

export default Page;