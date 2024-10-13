import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ForSalePage(){
    const [items, setItems] = useState([])

    useEffect(() => {
        axios.get('/user-items').then(({data}) => {
            setItems(data)

    });
}, []);


    // the first condition is for when the "add new item" button is not clicked
    // the second is to display the form once the button is clicked
    return (
        <div className="mt-4">
                <div className="items-center text-right">
                    <Link className="inline-flex gap-1 bg-secondary text-primary py-2 px-4 rounded-full transition duration-300 ease-in-out hover:bg-primary hover:text-secondary" to={'/account/forsale/new'}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Add new item
                    </Link>
                </div>
                    {items.length > 0 && items.map(item => (
                    <div className="mt-4 " key={item._id}>
                        <Link to={"/item/"+item._id}className="flex cursor-pointer gap-4 bg-secondary text-tertiary p-4 rounded-2xl mt-2">
                            <div className="flex w-32 h-4/4  border border-5 border-gray-500 rounded-2xl bg-gray-300 grow shrink-0">
                                {item.photos.length > 0 && (
                                    <img src={"http://localhost:4000/uploads/"+item.photos[0] } className="object-cover rounded-2xl" alt=""/>
                                )}
                            </div>
                            <div className="grow-0 shrink">
                                <div className="flex items-center">
                                <h2 className="text-xl text-primary font-semibold">{item.title}</h2>
                                <Link to={"/account/forsale/"+item._id}className="ml-auto right-0 bg-transparent text-primary hover:text-tertiary">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                    <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
                                    <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
                                </svg>
                                </Link>
                                </div>
                                <p className="text-sm mt-2">{item.description}</p>
                                <div className="flex inline items-center justify-between mt-5">
                                    <h2 className="font-bold text-primary">AED {item.price}</h2>
                                    <p className="text-l text-primary ml-auto mr-10">{item.details[0]}&nbsp;&nbsp;·&nbsp;&nbsp;{item.details[1]}&nbsp;&nbsp;·&nbsp;&nbsp;{item.details[2]}</p>
                                </div>
                            </div>
                        </Link>
                    </div>
                    ))}
                </div>
    )
}
