import axios from "axios";
import { useEffect, useState, useContext } from "react"
import { useParams } from "react-router-dom"
import { UserContext } from "../UserContext";

export default function ItemPage() {
    const {id} = useParams()
    const { user } = useContext(UserContext);
    const [item, setItem] = useState('')
    const [chatMessage, setChatMessage] = useState('')
    const [showAll, setShowAll] = useState(false)
    const [isWishlisted, setIsWishlisted] = useState(false);

    useEffect(() => {
        if (!id){
            return;
        }

        axios.get("/items/"+id).then( response => {
            setItem(response.data)
        })

        axios.post("/wishlist/check-item", { itemID: id }).then(response => {
            setIsWishlisted(response.data.exists);
        }).catch(error => {
            console.error("Error checking wishlist item:", error);
        });

    }, [id]);

    if (!item) return '';

    const wishlistButtonClassName = isWishlisted ? 
    "bg-primary text-white flex inline gap-2 justify-center mb-3 w-80 h-10 px-4 py-2 rounded-2xl font-semibold transition duration-300 ease-in-out hover:bg-secondary" :
    "bg-secondary text-white flex inline gap-2 justify-center mb-3 w-80 h-10 px-4 py-2 rounded-2xl font-semibold transition duration-300 ease-in-out hover:bg-primary";

    function updateWishlist() {
        if (isWishlisted) {
            axios.delete(`/wishlist/${id}`).then(response => {
                setIsWishlisted(false);
            }).catch(error => {
                console.error("Error removing item from wishlist:", error);
            });
        } else {
            axios.post("/wishlist", { itemId: id }).then(response => {
                setIsWishlisted(true);
            }).catch(error => {
                console.error("Error adding item to wishlist:", error);
            });
        }
    };


    function sendMessage() {

        if (!chatMessage.trim()){
            return;
        }

        axios.post('/messages', {
            recipient: item.seller,
            text: chatMessage
        }).then(response => {
            console.log("Message sent:", response.data);
            setChatMessage('');
        }).catch(error => {
            console.error("Error sending message:", error);
        });

    }

    if (showAll){
        return (
            <div className="absolute inset-0 min-h-full">
                <div className="flex justify-center p-8 grid bg-gray-200 gap-4">
                    <div>
                        <button onClick={() => {setShowAll(false)}} className="fixed top-5 right-5 flex text-white bg-black gap-1 py-2 px-2 bg-opacity-50 rounded-3xl transition duration-300 ease-in-out hover:bg-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                        </button>
                    </div>
                    {item?.photos?.length > 0 && item.photos.map(photo => (
                        <div key={photo}>
                            <img className="rounded-2xl shadow shadow-gray-400" src={"http://localhost:4000/uploads/"+photo}/>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return(
        <div className="mt-8 bg-gray-100 -mx-8 px-8 py-8">
            <div className="flex item-center border-3">
                <h1 className="text-2xl font-semibold">{item.title}</h1>
                <h1 className="text-slate-900 text-2xl font-bold ml-auto">AED {item.price}</h1>
            </div>
            <a className="flex gap-1 my-3 block font-semibold underline " target="_blank" href={"https://maps.google.com/?q="+item.address}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
                {item.address}
            </a>
            <div className="relative">
                <div className="grid gap-2 grid-cols-[2fr_1fr] rounded-3xl overflow-hidden">
                    <div>
                        {item.photos?.[0] && (
                            <img onClick={() => {setShowAll(true)}} className="aspect-square w-full object-cover"src={'http://localhost:4000/uploads/'+item.photos?.[0]}/>
                        )}
                    </div>
                    <div className="grid">
                        {item.photos?.[1] && (
                            <img onClick={() => {setShowAll(true)}} className="aspect-square object-cover"src={'http://localhost:4000/uploads/'+item.photos?.[1]}/>
                        )}
                        <div className="overflow-hidden">
                            {item.photos?.[2] && (
                                <img onClick={() => {setShowAll(true)}} className="aspect-square object-cover relative top-2"src={'http://localhost:4000/uploads/'+item.photos?.[2]}/>
                            )}
                        </div>
                    </div>
                </div>
                <button onClick={() => setShowAll(true)} className="absolute bottom-2 right-2 py-2 px-3 bg-white rounded-2xl shadow shadow-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                    </svg>
                </button>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="col-span-1">
                    <h2 className="font-bold text-2xl">Description</h2>
                    <p className="mt-4">{item.description}</p>
                </div>

                <div className="grid grid-cols-1 gap-4 h-full flex flex-col ">
                        <div className="flex flex-col justify-center">
                            <div className="flex gap-10 justify-center mb-10 mt-14">
                                {item.details?.length > 0 && item.details.map((detail, index) => (
                                    <div key={index} className="flex flex-col justify-center items-center text-black h-36 w-36 border border-2 shadow shadow-primary">
                                        {index === 0 && <span className="font-bold mb-2 text-black"> AGE</span>}
                                        {index === 1 && <span className="font-bold mb-2 text-black"> USAGE</span>}
                                        {index === 2 && <span className="font-bold mb-2 text-black"> CONDITION</span>}
                                        {detail}
                                    </div>
                                ))}
                            </div>
                            {user && (
                                <div className="flex flex-col items-center mt-auto justify-center">
                                    <button className={wishlistButtonClassName} onClick={updateWishlist}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                                        </svg>
                                        {isWishlisted ? "Remove from Wishlist":"Add to Wishlist"}
                                    </button>
                                    <div className="flex gap-1 w-80 items-center">
                                        <input type="text" value={chatMessage} onChange={(e) => setChatMessage(e.target.value)} placeholder=" send a message..." className=" w-2/3 bg-secondary text-tertiary" />
                                        <button onClick={sendMessage} className='w-10 h-10 bg-secondary flex justify-center items-center text-primary p-2 rounded-full transition duration-300 ease-in-out hover:bg-primary hover:text-black'>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                                            </svg>
                                        </button> 
                                    </div>
                                </div>
                            )}
                            
                </div>
            </div>
    </div>

</div>        
    )
}