import { useState, useRef, useEffect, type KeyboardEvent } from 'react';
import { useGeocode } from '../hooks/useGeocode';
import type { GeocodeResult } from '../types';

interface Props {
  onSelect: (city: GeocodeResult) => void;
  resetKey?: number;
}

function SearchIcon() {
  return (
    <svg className="search-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M7 12.5a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11ZM11.5 11.5 14 14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Autocomplete({ onSelect, resetKey = 0 }: Props) {
  const [value, setValue] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);
  const { results, open, search, close, select } = useGeocode();
  const fieldRef = useRef<HTMLDivElement>(null);
  const listId = 'city-suggestions';

  useEffect(() => {
    search(value);
  }, [value, search]);

  useEffect(() => {
    setValue('');
    setActiveIndex(-1);
    close();
  }, [resetKey, close]);

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
    <div className="search-field autocomplete-wrap" ref={fieldRef}>
      <label htmlFor="city">Buscar ciudad</label>
      <div className="search-input-wrap">
        <SearchIcon />
        <input
          id="city"
          type="text"
          role="combobox"
          aria-expanded={open && results.length > 0}
          aria-controls={listId}
          aria-autocomplete="list"
          placeholder="Ej: Santiago, Valparaíso, Concepción…"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setActiveIndex(-1);
          }}
          onKeyDown={handleKeyDown}
          autoComplete="off"
        />
      </div>
      {open && results.length > 0 && (
        <ul className="autocomplete-list" id={listId} role="listbox">
          {results.map((city, i) => (
            <li
              key={`${city.lat}-${city.lon}`}
              role="option"
              aria-selected={i === activeIndex}
              className={i === activeIndex ? 'active' : ''}
              onMouseDown={(e) => {
                e.preventDefault();
                handleSelect(city);
              }}
            >
              <span className="city-name">{city.name}</span>
              <span className="city-detail">
                {city.country}{city.state ? `, ${city.state}` : ''}
              </span>
            </li>
          ))}
        </ul>
      )}
      {!open && value.length > 0 && value.length < 2 && (
        <p className="autocomplete-hint">Escribe al menos 2 caracteres</p>
      )}
    </div>
  );
}
