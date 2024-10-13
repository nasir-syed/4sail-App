import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function WishlistPage() {
    const [wishlistItems, setWishlistItems] = useState([]);
    

    useEffect(() => {
        axios.get("/user-wishlist")
            .then(response => {
                setWishlistItems(response.data);
            })
            .catch(error => {
                console.error("Error retrieving wishlist items:", error);
            });
    }, []);

    return (
        <div>
            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Your Wishlist</h2>
                {wishlistItems.length > 0 ? (
                    wishlistItems.map(item => (
                        <Link to={"/item/"+item._id}className="flex cursor-pointer gap-4 bg-secondary text-tertiary p-4 rounded-2xl mt-2">
                        <div className="flex w-32 h-4/4  border border-5 border-gray-500 rounded-2xl bg-gray-300 grow shrink-0">
                            {item.photos.length > 0 && (
                                <img src={"http://localhost:4000/uploads/"+item.photos[0] } className="object-cover rounded-2xl" alt=""/>
                            )}
                        </div>
                        <div className="grow-0 shrink">
                            <h2 className="text-xl text-primary font-semibold">{item.title}</h2>
                            <p className="text-sm mt-2">{item.description}</p>
                            <div className="flex inline items-center justify-between mt-2">
                                <h2 className="font-bold text-primary">AED {item.price}</h2>
                                <p className="text-l text-primary ml-auto mr-10">{item.details[0]} · {item.details[1]} · {item.details[2]}</p>
                            </div>
                        </div>
                    </Link>
                    ))
                ) : (
                    <p className="text-gray-600">Your wishlist is empty.</p>
                )}
            </div>
        </div>
    );
}
