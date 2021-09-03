import { FormEvent, useState, useCallback } from 'react';
import SearchResults from '../components/SearchResults';

type Results = {
  totalPrice: number;
  data: any[];
}

const Home = () => {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<Results>({
    totalPrice: 0,
    data: []
  });

  const formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })

  async function handleSearch(event: FormEvent) {
    event.preventDefault();

    if (!search.trim()) {
      return;
    }

    const response = await fetch(`http://localhost:3333/products?q=${search}`);
    const data = await response.json();

    const products = data.map((product: { id: any; title: any; price: number | bigint; }) => {
      return {
        id: product.id,
        title: product.title,
        price: product.price,
        priceFormatted: formatter.format(product.price)
      }
    })

    const totalPrice = data.reduce((total: any, product: { price: any; }) => {
      return total + product.price
    }, 0)

    setResults({ totalPrice, data: products });
  }

  const addToWishList = useCallback((id: number) => {
    console.log(id);
  }, []);

  return (
    <div>
      <h1>Search:</h1>

      <form onSubmit={handleSearch}>
        <input 
          type="text" 
          value={search} 
          onChange={(e) => 
          setSearch(e.target.value)} 
        />
        <button type="submit">Buscar</button>
      </form>

      <SearchResults 
        results={results.data}
        totalPrice={results.totalPrice}
        onAddToWishList={addToWishList}
      />
    </div>
  )
}

export default Home
