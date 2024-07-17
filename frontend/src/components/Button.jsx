export const Button = ({label, onClick}) => {
    return <button onClick={onClick} type="button" className="w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent rounded-lg px-5 py-2.5 mb-2 me-2 ">{label}</button>
}