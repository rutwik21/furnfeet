import { Input } from './ui/input'

const SearchBar = ({className}:{className?: string}) => {
  return (
    <div>
        <Input placeholder='Search' className={className?className:''} />
    </div>
  )
}

export default SearchBar