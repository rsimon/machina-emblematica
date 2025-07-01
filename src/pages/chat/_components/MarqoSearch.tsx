import { useState, type FormEvent } from 'react';
import { useSearch } from '../_hooks/useSearch';

export const MarqoSearch = () => {

  const [value, setValue] = useState('');

  const { search } = useSearch();

  const onSubmit = (evt: FormEvent) => {
    evt.preventDefault();

    search(value);
  }

  return (
    <main className="text-white">
      <form onSubmit={onSubmit}>
        <input 
          autoFocus
          value={value}
          onChange={evt => setValue(evt.target.value)} />
      </form>
    </main>
  )

}