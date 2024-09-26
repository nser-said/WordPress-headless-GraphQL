'use client'; // تأكد من أن هذا المكون يعمل في بيئة العميل  
import { useEffect, useState } from 'react';  
import { useRouter } from 'next/navigation';  

const Search = () => {  
  const [searchTerm, setSearchTerm] = useState('');  
  const [results, setResults] = useState([]);  
  const [searchHistory, setSearchHistory] = useState([]);  
  const [suggestions, setSuggestions] = useState([]);  
  const [isFocused, setIsFocused] = useState(false);  
  const router = useRouter();  

  const fetchPosts = async () => {  
    if (searchTerm.length > 0) {  
      const query = `  
        query SearchPosts($search: String!) {  
          posts(where: { search: $search }) {  
            nodes {  
              id  
              slug  
              title  
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
          body: JSON.stringify({  
            query,  
            variables: { search: searchTerm },  
          }),  
        });  

        const { data } = await res.json();  
        if (data.posts.nodes.length > 0) {  
          setResults(data.posts.nodes);  
          // توجيه المستخدم إلى أول بوست في النتائج  
          router.push(`/blog/${data.posts.nodes[0].id}`);  
          // إضافة الكلمة إلى التاريخ إذا لم تكن موجودة مسبقًا  
          if (!searchHistory.includes(searchTerm)) {
            setSearchHistory([...searchHistory, searchTerm]);
          }
        } else {  
          setResults([]);  
        }  
      } catch (error) {  
        console.error('خطأ في البحث:', error);  
      }  
    } else {  
      setResults([]);  
    }  
  };  

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      fetchPosts();
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.length > 0) {
      setSuggestions(searchHistory.filter(term => term.toLowerCase().includes(value.toLowerCase())));
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setSuggestions([]);
    fetchPosts();
  };

  return (  
    <div>  
      <input  
        
        className="relative m-0 block  min-w-0 flex-auto rounded border border-solid border-secondary-500 bg-transparent bg-clip-padding px-3 py-1.5 text-base font-normal text-white transition duration-300 ease-in-out focus:border-primary focus:text-white focus:shadow-inset focus:outline-none motion-reduce:transition-none dark:border-white/10 dark:bg-body-dark dark:text-white dark:placeholder:text-neutral-300 dark:autofill:shadow-autofill"
        type="text"  
        value={searchTerm}  
        onChange={handleChange}  
        onKeyDown={handleKeyDown}  
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="ابحث عن البوستات..."  
        required  
      />  
      {isFocused && suggestions.length > 0 && (
        <ul >
          {suggestions.map((suggestion, index) => (
            <li key={index} onMouseDown={() => handleSuggestionClick(suggestion)} >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>  
  );  
};  

export default Search;
