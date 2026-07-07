import { useState, useRef, useEffect, type KeyboardEvent } from 'react';
import { useGeocode } from '../hooks/useGeocode';
import type { GeocodeResult } from '../types';

interface Props {
  onSelect: (city: GeocodeResult) => void;
}

export function Autocomplete({ onSelect }: Props) {
  const [value, setValue] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);
  const { results, open, search, close, select } = useGeocode();
  const inputRef = useRef<HTMLInputElement>(null);
  const fieldRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    search(value);
  }, [value, search]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (fieldRef.current && !fieldRef.current.contains(e.target as Node)) {
        close();
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [close]);

  function handleKeyDown(e: KeyboardEvent) {
    if (!open || !results.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + results.length) % results.length);
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      handleSelect(results[activeIndex]);
    } else if (e.key === 'Escape') {
      close();
    }
  }

  function handleSelect(city: GeocodeResult) {
    const selected = select(city);
    setValue(selected.name);
    setActiveIndex(-1);
    onSelect(selected);
  }

  return (
    <div className="field autocomplete-wrap" ref={fieldRef}>
      <label htmlFor="city">Ciudad</label>
      <input
        id="city"
        ref={inputRef}
        type="text"
        placeholder="Ej: Santiago"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setActiveIndex(-1);
        }}
        onKeyDown={handleKeyDown}
        autoComplete="off"
      />
      {open && results.length > 0 && (
        <ul className="autocomplete-list" role="listbox">
          {results.map((city, i) => (
            <li
              key={`${city.lat}-${city.lon}`}
              role="option"
              className={i === activeIndex ? 'active' : ''}
              onMouseDown={(e) => {
                e.preventDefault();
                handleSelect(city);
              }}
            >
              <span className="city-name">{city.name}</span>
              <span className="city-detail">
                {city.country}{city.state ? ` — ${city.state}` : ''}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
