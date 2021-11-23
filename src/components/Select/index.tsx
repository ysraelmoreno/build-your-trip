import { useField } from '@unform/core';
import { TriangleDownIcon, TriangleUpIcon } from '@modulz/radix-icons';
import {
  useEffect,
  useState,
  InputHTMLAttributes,
  useRef,
  RefObject,
} from 'react';
import {
  SelectWrapper,
  OptionsContainer,
  Option,
  SelectContainer,
} from './styles';
import Portal from 'components/Portal';

interface IOption {
  label: string;
  value: number;
}

interface SelectProps extends InputHTMLAttributes<HTMLInputElement> {
  options: IOption[];
  name: string;
  variant?: 'default' | 'outlined';
}

function Select({ options, name, variant = 'default', ...props }: SelectProps) {
  const [selected, setSelected] = useState(options[0].label);
  const [optionsItem, setOptionsItem] = useState<IOption[]>([]);
  const [active, setActive] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [xPosition, setXPosition] = useState(0);
  const [yPosition, setYPosition] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const { fieldName, registerField } = useField(name);

  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setOptionsItem(options);
  }, [options]);

  function handleOpen() {
    setIsOpen(!isOpen);
    setActive(!active);
  }

  function handleSelect(label: string) {
    setSelected(label);
    setIsOpen(false);
    setActive(!active);
  }

  useEffect(() => {
    if (inputRef.current) {
      registerField({
        name: fieldName,
        ref: inputRef,
        getValue: (ref: RefObject<HTMLInputElement>) =>
          ref.current ? ref.current.value : '',
        setValue: (ref: RefObject<HTMLInputElement>, value: string) =>
          ref.current ? (ref.current.value = value) : value,
        clearValue: (ref: RefObject<HTMLInputElement>) =>
          ref.current ? (ref.current.value = '') : '',
      });
    }
  }, [fieldName, registerField]);

  useEffect(() => {
    if (triggerRef.current && isOpen) {
      setXPosition(triggerRef.current.getBoundingClientRect().x);
      setYPosition(triggerRef.current.getBoundingClientRect().y);
    }
  }, [isOpen]);

  return (
    <>
      <SelectContainer>
        <SelectWrapper
          variant={variant}
          type="button"
          ref={triggerRef}
          active={active}
          onClick={handleOpen}
        >
          {selected} {isOpen ? <TriangleUpIcon /> : <TriangleDownIcon />}
        </SelectWrapper>
        <Portal>
          <OptionsContainer
            css={{
              transform: `translate(${xPosition}px, ${yPosition}px)`,
            }}
            isSelecting={isOpen}
          >
            {optionsItem.map(({ label, value }) => (
              <Option
                data-value={value}
                key={value}
                onClick={() => handleSelect(label)}
              >
                {label}
              </Option>
            ))}
          </OptionsContainer>
        </Portal>
        <input type="hidden" ref={inputRef} value={selected} {...props} />
      </SelectContainer>
    </>
  );
}

export default Select;
