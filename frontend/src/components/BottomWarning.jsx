import {Link} from 'react-router-dom'

export const BottomWarning = ({label, buttonText, to}) => {
    return <div className='flex justify-center py-2 text-sm'>
        <div>
            {label}
        </div>
        <Link to={to} className='pointer underline pl-1 curosr-pointer'>
            {buttonText}
        </Link>
    </div>
}