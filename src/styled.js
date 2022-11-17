import styled from 'styled-components';

const calcPxSize = (value) => {
  if (!value) {
    return null;
  }
  const regex = new RegExp(/^[0-9]*px*$/);
  if (regex.test(value)) {
    // string with px at the end
    return value;
  }
  return isNaN(Number(value)) ? null : `${value}px`;
};

export const RowButton = styled.button`
  border: none;
  background-color: transparent;
  color: currentColor;
  cursor: pointer;
  align-items: center;
  padding: 0px 0px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-left: auto;
  margin-right: auto;
  text-align:left
`;

export const DataContainer = styled.div.attrs(() => {
  return {
    'data-el': 'data-container',
  };
})`
  width: 100%;
  flex: 1 1 0;
  overflow: ${({ overflow }) => overflow || 'auto'};
  position: relative;
  opacity: ${({ obsoleteData }) => (obsoleteData ? 0.4 : 1)};
  ${({ customTable }) => (customTable ? 'height' : 'max-height')}: ${({ tableHeight, customTable, height }) => {
    return customTable
      ? calcPxSize(height < 200
        ? 200
        : height < 800
        ? height / 2
        : height < 900
        ? height / 1.65
        : height / 1.55)
      : calcPxSize(tableHeight) || 'auto';
  }};
  x:1;
`;