'use client';  
import React, { useState, useEffect } from 'react';  
import Link from "next/link";  
import Search from "@/components/Search/Search";

const Nav = () => {  
  const [menus, setMenus] = useState([]);  
  const [loading, setLoading] = useState(true);  
  const [error, setError] = useState(null);  

  useEffect(() => {  
    const fetchMenus = async () => {  
      const query = `  
   {
  menus {
    nodes {
      id
      databaseId
      name
      menuItems {
        edges {
          node {
            id
            label
            url
            parentId
          }
        }
      }
    }
  }
} 
      `;  

      try {  
        const res = await fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_API}`, {  
          method: 'POST',  
          headers: {  
            'Content-Type': 'application/json',  
          },  
          body: JSON.stringify({ query }),  
        });  

        if (!res.ok) {  
          throw new Error('Network response was not ok');  
        }  
        
        const { data } = await res.json();  

        if (data && data.menus.nodes) {  
          setMenus(data.menus.nodes);  
        } else {  
          throw new Error('Menu data not available');  
        }  
      } catch (error) {  
        setError(error.message);  
      } finally {  
        setLoading(false);  
      }  
    };  

    fetchMenus();  
  }, []);  
  /*
  if (loading) return <div>Loading...</div>;  
  if (error) return <div>Error: {error}</div>;*/
    return (
        <div>
            <header className="bg-black">
  <div className="mx-auto flex h-16 max-w-screen-xl items-center gap-8 px-4 sm:px-6 lg:px-8">
    <Link className="block text-green-500" href={"/"}>
      <span className="sr-only">Home</span>
      <svg className="h-8" viewBox="0 0 28 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M0.41 10.3847C1.14777 7.4194 2.85643 4.7861 5.2639 2.90424C7.6714 1.02234 10.6393 0 13.695 0C16.7507 0 19.7186 1.02234 22.1261 2.90424C24.5336 4.7861 26.2422 7.4194 26.98 10.3847H25.78C23.7557 10.3549 21.7729 10.9599 20.11 12.1147C20.014 12.1842 19.9138 12.2477 19.81 12.3047H19.67C19.5662 12.2477 19.466 12.1842 19.37 12.1147C17.6924 10.9866 15.7166 10.3841 13.695 10.3841C11.6734 10.3841 9.6976 10.9866 8.02 12.1147C7.924 12.1842 7.8238 12.2477 7.72 12.3047H7.58C7.4762 12.2477 7.376 12.1842 7.28 12.1147C5.6171 10.9599 3.6343 10.3549 1.61 10.3847H0.41ZM23.62 16.6547C24.236 16.175 24.9995 15.924 25.78 15.9447H27.39V12.7347H25.78C24.4052 12.7181 23.0619 13.146 21.95 13.9547C21.3243 14.416 20.5674 14.6649 19.79 14.6649C19.0126 14.6649 18.2557 14.416 17.63 13.9547C16.4899 13.1611 15.1341 12.7356 13.745 12.7356C12.3559 12.7356 11.0001 13.1611 9.86 13.9547C9.2343 14.416 8.4774 14.6649 7.7 14.6649C6.9226 14.6649 6.1657 14.416 5.54 13.9547C4.4144 13.1356 3.0518 12.7072 1.66 12.7347H0V15.9447H1.61C2.39051 15.924 3.154 16.175 3.77 16.6547C4.908 17.4489 6.2623 17.8747 7.65 17.8747C9.0377 17.8747 10.392 17.4489 11.53 16.6547C12.1468 16.1765 12.9097 15.9257 13.69 15.9447C14.4708 15.9223 15.2348 16.1735 15.85 16.6547C16.9901 17.4484 18.3459 17.8738 19.735 17.8738C21.1241 17.8738 22.4799 17.4484 23.62 16.6547ZM23.62 22.3947C24.236 21.915 24.9995 21.664 25.78 21.6847H27.39V18.4747H25.78C24.4052 18.4581 23.0619 18.886 21.95 19.6947C21.3243 20.156 20.5674 20.4049 19.79 20.4049C19.0126 20.4049 18.2557 20.156 17.63 19.6947C16.4899 18.9011 15.1341 18.4757 13.745 18.4757C12.3559 18.4757 11.0001 18.9011 9.86 19.6947C9.2343 20.156 8.4774 20.4049 7.7 20.4049C6.9226 20.4049 6.1657 20.156 5.54 19.6947C4.4144 18.8757 3.0518 18.4472 1.66 18.4747H0V21.6847H1.61C2.39051 21.664 3.154 21.915 3.77 22.3947C4.908 23.1889 6.2623 23.6147 7.65 23.6147C9.0377 23.6147 10.392 23.1889 11.53 22.3947C12.1468 21.9165 12.9097 21.6657 13.69 21.6847C14.4708 21.6623 15.2348 21.9135 15.85 22.3947C16.9901 23.1884 18.3459 23.6138 19.735 23.6138C21.1241 23.6138 22.4799 23.1884 23.62 22.3947Z"
          fill="currentColor"
        />
      </svg>
    </Link>

    <div className="flex flex-1 items-center justify-end md:justify-between">
      <nav aria-label="Global" className="hidden md:block">
        <ul className="flex items-center gap-6 text-sm">
          <li>
            <Link className="text-white transition hover:text-gray-500/75" href={"/about"}> About </Link>
          </li>

          <li>
            <Link className="text-white transition hover:text-gray-500/75" href={"/blog"}> Blog </Link>
          </li>

       
        </ul>
      </nav>

      <nav aria-label="Global" className="hidden md:block">  
      {menus.map(menu => (  
        <div key={menu.id} className="mx-auto flex h-16 max-w-screen-xl items-center gap-8 px-4 sm:px-6 lg:px-8">  
        
          <ul className="flex items-center gap-6 text-sm">  
            {menu.menuItems.edges.map(item => (  
              <li key={item.node.id}>  
                <Link href={item.node.url}>{item.node.label}</Link>  
                {item.node.menuItems && item.node.menuItems.edges.length > 0 && (  
                  <ul>  
                    {item.node.menuItems.edges.map(subItem => (  
                      <li key={subItem.node.id}>  
                        <Link href={subItem.node.url}>{subItem.node.label}</Link>  
                      </li>  
                    ))}  
                  </ul>  
                )}  
              </li>  
            ))}  
          </ul>  
        </div>  
      ))} 
                    </nav>




      <div className="flex items-center gap-4">
        <div className="sm:flex sm:gap-4">
        <Search  />
        <span
        class="flex items-center whitespace-nowrap rounded px-3 py-1.5 text-center text-base font-normal text-gray-600 dark:text-white [&>svg]:w-5"
        id="basic-addon2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor">
          <path
            fill-rule="evenodd"
            d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
            clip-rule="evenodd" />
        </svg>
      </span>
        
    </div>
    </div>
    </div>
  </div>
</header>
        </div>
    );
}

export default Nav;
