import React, { Component } from 'react';
import { convertTimestampToDateString } from '../helpers';

interface SelectButtonsProps {
  options: number[] | string[];
  updateSelectedPair? : (newState: string) => void
  updateSelectedDate? : (newState: number) => void
}

interface SelectButtonsState {
  selectedOption: number | string | null;
}

class SelectButtons extends Component<SelectButtonsProps, SelectButtonsState> {
  constructor(props: SelectButtonsProps) {
    super(props);
    this.state = {
      selectedOption: null
    };
  }

  handleSelectOption = (option: number | string) => {
    this.setState({ selectedOption: (option) });
    this.props.updateSelectedPair && typeof option === "string" && this.props.updateSelectedPair(option)
    this.props.updateSelectedDate && typeof option === "number" && this.props.updateSelectedDate(option)
  };

  render() {
    const { options } = this.props;
    const { selectedOption } = this.state;
    return (
      <div>
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => {
              this.handleSelectOption(option)
            }}
            style={{ marginRight: '20px', marginBottom: '20px', }}
          >
            {typeof option === "number" ? convertTimestampToDateString(option) : option}
          </button>
        ))}
        {selectedOption && <span>Selected Option: {typeof selectedOption === "number" ? convertTimestampToDateString(selectedOption) : selectedOption || 'None'}</span>}
      </div>
    );
  }
}

export default SelectButtons;
