import Image from "next/image";  
import Link from "next/link";  
import Balancer from "react-wrap-balancer";




export const generateMetadata = async ({ params }) => {  
  const query = `  
  {  
    post(id: "${params.id}", idType: ID) {  
      title  
    }  
  }  
  `;  

  const res = await fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_API}?query=${encodeURIComponent(query)}`, {  
      method: 'GET',  
      headers: {  
          'Content-Type': 'application/json',  
      },  
  });  

  const { data } = await res.json();  
  const post = data.post;  

  return {  
    title: ` ${post.title}`, // استخدام عنوان البوست المستخرج من API  
  };  
};

export default async function Post({ params }) {  
  const query = `  
  {  
    post(id: "${params.id}", idType: ID) {  
      date  
      slug  
      id  
      title  
      excerpt  
      content  
      featuredImage {  
        node {  
          mediaDetails {  
            width  
            height  
            sizes {  
              sourceUrl  
            }  
          }  
        }  
      }  
      author {  
        node {  
          name  
          id  
        }  
      }  
      categories {  
        nodes {  
          id  
          name  
        }  
      }  
    }  
  }  
  `;  

  const res = await fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_API}?query=${encodeURIComponent(query)}`, {  
      method: 'GET',  
      headers: {  
          'Content-Type': 'application/json',  
      },  
  });  

  const { data } = await res.json();  
  const post = data.post;  

  if (!post) {  
      return <div>Post not found</div>;  
  }  

  const { date, author, featuredImage, categories } = post;  
  const mediaDetails = featuredImage?.node?.mediaDetails;  
  const imageUrl = mediaDetails?.sizes ? mediaDetails.sizes[0].sourceUrl : '/default-image.jpg';  

  return (  
    <div className="container mx-auto px-4">  
      <h1>  
        <Balancer>  
          <span  
            dangerouslySetInnerHTML={{ __html: post.title }}  
          ></span>  
        </Balancer>  
      </h1>  

      <div className="flex justify-between items-center gap-4 text-sm mb-4">  
        <h5>  
          Published {new Date(date).toLocaleDateString()} by{" "}  
          {author?.node?.name && (  
            <span>  
              <a href={`/posts/?author=${author.node.id}`}>{author.node.name}</a>{" "}  
            </span>  
          )}  
        </h5>  
        {categories.nodes.map((category) => (  
          <Link  
            href={`/posts/?category=${category.id}`}  
            key={category.id}  
            className="not-prose border border-blue-500"  
          >  
            {category.name}  
          </Link>  
        ))}  
     </div>
     <div className="relative overflow-hidden bg-cover bg-no-repeat" data-twe-ripple-init data-twe-ripple-color="light">  
        <div className=" w-full overflow-hidden relative rounded-md  flex items-center justify-center">  
          <Image  
            src={post.featuredImage?.node?.mediaDetails?.sizes[5]?.sourceUrl} // تأكد من اختيار الحجم المناسب  
            width={600} // تعديل العرض بناءً على حجم الصورة، يمكنك تغييره حسب الحجم الفعلي للصورة  
            height={600} // تعديل الارتفاع بناءً على حجم الصورة  
            className="rounded-t-lg object-cover" // إضافة object-cover لجعل الصورة تغطي المساحة  
            alt={post.title}  
          />  
        </div>
      <div dangerouslySetInnerHTML={{ __html: post.content }} /> 
</div>
</div>


      
     
     
  );  
}
