import React from 'react';

type LetterFilterProps = {
  selectedFilterLetter: string;
  onChange(e: React.ChangeEvent<HTMLSelectElement>): void;
  onClearClick(): void;
};

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

/**
 * Componente responsável por listar itens filtrados a partir de uma letra selecionada.
 */
export default function LetterFilter({
  onChange,
  onClearClick,
  selectedFilterLetter,
}: LetterFilterProps) {
  return (
    <div>
      <label htmlFor="letter-filter">Filter by letter: </label>
      <select
        id="letter-filter"
        onChange={onChange}
        value={selectedFilterLetter}
      >
        <option value="">All</option>
        {ALPHABET.map((letter) => (
          <option value={letter} key={letter}>
            {letter}
          </option>
        ))}
      </select>
      <button
        className="btn btn-clear"
        onClick={onClearClick}
        disabled={!selectedFilterLetter}
      >
        Clear
      </button>
    </div>
  );
}
