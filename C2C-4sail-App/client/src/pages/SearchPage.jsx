import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';

function SearchPage() {
    const [searchResults, setSearchResults] = useState([]);
    const { query } = useParams(); 

    useEffect(() => {
        console.log(query);

        axios.get(`/search-items/${query}`)
            .then(response => {
                setSearchResults(response.data);
            })
            .catch(error => {
                console.error('Error fetching search results:', error);
            });

    }, [query]);

    if (!query) {
        return <Navigate to="/" />;
    }

    return (
        <div className="mt-8 gap-x-6 gap-y-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {searchResults.length > 0 ? (
                searchResults.map(item => (
                <Link to={'/item/'+item._id} key={item._id} className="bg-secondary rounded-xl p-3">
                    <div className="bg-black mb-2 rounded-2xl flex">
                        {item.photos?.[0] && (
                        <img className="rounded-2xl shadow-sm shadow-primary object-cover aspect-square" src={'http://localhost:4000/uploads/'+item.photos?.[0]} alt=""/>
                        )} 
                    </div>      
                    <h2 className="font-bold text-lg text-tertiary">{item.title}</h2>
                    <h2 className="text-md text-primary">{item.address}</h2>
                    <h3 className="text-sm text-tertiary truncate">{item.description}</h3>
                    <div className="mt-1">
                        <span className="font-bold text-primary">AED {item.price}</span>
                    </div>
                </Link>
                ))
            ) : (
                <p className="text-gray-600">No results found for "{query}"</p>
            )}
        </div>
    );
}

export default SearchPage;
