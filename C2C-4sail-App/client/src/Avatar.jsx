export default function Avatar({name}){

    const colours = ['bg-green-200', 'bg-red-200', 'bg-blue-200', 'bg-purple-200', 'bg-yellow-200']

    const index = name.length % 5

    return (
        <div className={`flex items-center justify-center font-bold text-secondary w-8 h-8 ${colours[index]} rounded-full`}>{name[0]}</div>
    )
}