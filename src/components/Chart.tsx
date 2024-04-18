// v-1 with viewport problem on scroll

// import React, { Component, WheelEvent } from 'react';

// interface ForexDataItem {
//     Time: number;
//     Open: number;
//     High: number;
//     Low: number;
//     Close: number;
//     TickVolume: number;
// }

// interface Props {
//     data: ForexDataItem[];
// }

// interface State {
//     scale: number;
// }

// class ForexChart extends Component<Props, State> {
//     canvasRef: React.RefObject<HTMLCanvasElement>;
//     labelsContainerRef: React.RefObject<HTMLDivElement>;
//     containerRef: React.RefObject<HTMLDivElement>;

//     constructor(props: Props) {
//         super(props);
//         this.canvasRef = React.createRef();
//         this.labelsContainerRef = React.createRef();
//         this.containerRef = React.createRef();
//         this.state = {
//             scale: 1,
//         };
//     }

//     componentDidMount() {
//         this.drawChart();
//     }

//     componentDidUpdate() {
//         this.drawChart();
//     }

//     handleWheel = (event: WheelEvent<HTMLDivElement>) => {
//         const { deltaY } = event;
//         const { scale } = this.state;
//         const newScale = deltaY > 0 ? scale * 0.9 : scale * 1.1;
//         this.setState({ scale: newScale });
//     }

//     handleScroll = () => {
//       this.drawChart();
//     }

//     // drawChart() {
//     //     const { data } = this.props;
//     //     const { scale } = this.state;
//     //     const canvas = this.canvasRef.current!;
//     //     const ctx = canvas.getContext('2d')!;
//     //     const height = canvas.height;
        
      
//     //     // Find highest and lowest values for scaling
//     //     const highs = data.map(item => item.High);
//     //     const lows = data.map(item => item.Low);
//     //     const highest = Math.max(...highs);
//     //     const lowest = Math.min(...lows);
//     //     const range = highest - lowest;
      
//     //     // Calculate candle width and padding
//     //     const numColumns = data.length;
//     //     const minColumnWidth = 0.5; // Adjust the minimum width as needed
//     //     let columnWidth = (800 * 0.8) / numColumns * scale;
//     //     const adjustedColumnWidth = Math.max(minColumnWidth, columnWidth);
//     //     const padding = 0.2 * adjustedColumnWidth; // Adjust padding as needed
      
//     //     // Calculate the total width of the chart
//     //     const totalWidth = numColumns * adjustedColumnWidth;
      
//     //     // Set canvas width to the total width plus padding to ensure space for scrollbar
//     //     canvas.width = totalWidth + 30;
      
//     //     // Calculate the index of the first visible item
//     //     const firstVisibleIndex = Math.max(0, Math.floor(-padding / adjustedColumnWidth));
      
//     //     // Calculate the index of the last visible item
//     //     const lastVisibleIndex = Math.min(numColumns - 1, Math.ceil((800 - padding) / adjustedColumnWidth));
      
//     //     // Calculate the range of data currently visible
//     //     const visibleData = data.slice(firstVisibleIndex, lastVisibleIndex + 1);
//     //     const visibleHighs = visibleData.map(item => item.High);
//     //     const visibleLows = visibleData.map(item => item.Low);
//     //     const visibleHighest = Math.max(...visibleHighs);
//     //     const visibleLowest = Math.min(...visibleLows);
//     //     const visibleRange = visibleHighest - visibleLowest;
      
//     //     // Calculate y-axis label positions based on the visible range
//     //     const numLabels = 15;
//     //     const labelInterval = visibleRange / (numLabels - 1);
//     //     const labelPositions = Array.from({ length: numLabels }, (_, i) => visibleLowest + i * labelInterval);
      
//     //     // Draw y-axis labels on the right side
//     //     const labelsContainer = this.labelsContainerRef.current!;
//     //     labelsContainer.innerHTML = '';
//     //     labelPositions.forEach(label => {
//     //         const y = ((label - visibleLowest) / visibleRange) * height;
//     //         const labelElement = document.createElement('div');
//     //         labelElement.textContent = label.toFixed(5);
//     //         labelElement.style.position = 'absolute';
//     //         labelElement.style.right = '0';
//     //         labelElement.style.top = y + 'px';
//     //         labelElement.style.background = 'white'; // Set background color to white
//     //         labelsContainer.appendChild(labelElement);
//     //     });
      
//     //     // Draw horizontal gridlines
//     //     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     //     ctx.strokeStyle = '#ccc';
//     //     ctx.lineWidth = 0.5;
//     //     labelPositions.forEach(label => {
//     //         const y = ((label - visibleLowest) / visibleRange) * height;
//     //         ctx.beginPath();
//     //         ctx.moveTo(0, y);
//     //         ctx.lineTo(totalWidth, y);
//     //         ctx.stroke();
//     //     });
      
//     //     // Variable to keep track of current index
//     //     let currentIndex = firstVisibleIndex;
      
//     //     // Draw candles
//     //     visibleData.forEach(item => {
//     //         const x = currentIndex * adjustedColumnWidth + padding; // Adjust x position based on scale
//     //         const candleHeight = (item.High - item.Low) / visibleRange * height;
//     //         const candleTop = (visibleHighest - item.High) / visibleRange * height;
      
//     //         ctx.strokeStyle = item.Open > item.Close ? 'red' : 'green';
//     //         ctx.fillStyle = item.Open > item.Close ? 'red' : 'green';
      
//     //         // Draw candlestick body
//     //         ctx.fillRect(x, candleTop, adjustedColumnWidth - 2 * padding, candleHeight);
      
//     //         // Draw candlestick wicks
//     //         ctx.beginPath();
//     //         ctx.moveTo(x + 0.5 * adjustedColumnWidth, (visibleHighest - item.High) / visibleRange * height);
//     //         ctx.lineTo(x + 0.5 * adjustedColumnWidth, (visibleHighest - item.Close) / visibleRange * height);
//     //         ctx.stroke();
      
//     //         ctx.beginPath();
//     //         ctx.moveTo(x + 0.5 * adjustedColumnWidth, (visibleHighest - item.Low) / visibleRange * height);
//     //         ctx.lineTo(x + 0.5 * adjustedColumnWidth, (visibleHighest - item.Open) / visibleRange * height);
//     //         ctx.stroke();
      
//     //         currentIndex++;
//     //     });
//     // }

    
  //   drawChart() {
  //     const { data } = this.props;
  //     const { scale } = this.state;
  //     const canvas = this.canvasRef.current!;
  //     const ctx = canvas.getContext('2d')!;
  //     const height = canvas.height;
  
  //     // Find highest and lowest values for scaling
  //     const highs = data.map(item => item.High);
  //     const lows = data.map(item => item.Low);
  //     const highest = Math.max(...highs);
  //     const lowest = Math.min(...lows);
  //     const range = highest - lowest;
  
  //     // Calculate candle width and padding
  //     const numColumns = data.length;
  //     const minColumnWidth = 0.5; // Adjust the minimum width as needed
  //     let columnWidth = (800 * 0.8) / numColumns * scale;
  //     const adjustedColumnWidth = Math.max(minColumnWidth, columnWidth);
  //     const padding = 0.2 * adjustedColumnWidth; // Adjust padding as needed
  
  //     // Calculate the total width of the chart
  //     const totalWidth = numColumns * adjustedColumnWidth;
  
  //     // Set canvas width to the total width plus padding to ensure space for scrollbar
  //     canvas.width = totalWidth + 30;
  
  //     // Calculate the index of the first visible item
  //     const firstVisibleIndex = Math.max(0, Math.floor(-padding / adjustedColumnWidth));
  
  //     // Calculate the index of the last visible item
  //     const lastVisibleIndex = Math.min(numColumns - 1, Math.ceil((800 - padding) / adjustedColumnWidth));
  
  //     // Calculate the range of data currently visible
  //     const visibleData = data.slice(firstVisibleIndex, lastVisibleIndex + 1);
  //     const visibleHighs = visibleData.map(item => item.High);
  //     const visibleLows = visibleData.map(item => item.Low);
  //     const visibleHighest = Math.max(...visibleHighs);
  //     const visibleLowest = Math.min(...visibleLows);
  //     const visibleRange = visibleHighest - visibleLowest;
  
  //     // Draw y-axis labels on the right side
  //     const labelsContainer = this.labelsContainerRef.current!;
  //     labelsContainer.innerHTML = '';
  //     const numLabels = 15;
  //     const labelInterval = visibleRange / (numLabels - 1);
  //     for (let i = 0; i < numLabels; i++) {
  //         const label = visibleLowest + i * labelInterval;
  //         const y = ((label - visibleLowest) / visibleRange) * height;
  //         const labelElement = document.createElement('div');
  //         labelElement.textContent = label.toFixed(5);
  //         labelElement.style.position = 'absolute';
  //         labelElement.style.right = '0';
  //         labelElement.style.top = y + 'px';
  //         labelElement.style.background = 'white'; // Set background color to white
  //         labelsContainer.appendChild(labelElement);
  //     }
  
  //     // Draw horizontal gridlines
  //     ctx.clearRect(0, 0, canvas.width, canvas.height);
  //     ctx.strokeStyle = '#ccc';
  //     ctx.lineWidth = 0.5;
  //     for (let i = 0; i < numLabels; i++) {
  //         const y = ((visibleLowest + i * labelInterval - visibleLowest) / visibleRange) * height;
  //         ctx.beginPath();
  //         ctx.moveTo(0, y);
  //         ctx.lineTo(totalWidth, y);
  //         ctx.stroke();
  //     }
  
  //     // Variable to keep track of current index
  //     let currentIndex = firstVisibleIndex;
  
  //     // Draw candles
  //     visibleData.forEach(item => {
  //         const x = currentIndex * adjustedColumnWidth + padding; // Adjust x position based on scale
  //         const candleHeight = (item.High - item.Low) / visibleRange * height;
  //         const candleTop = (visibleHighest - item.High) / visibleRange * height;
  
  //         ctx.strokeStyle = item.Open > item.Close ? 'red' : 'green';
  //         ctx.fillStyle = item.Open > item.Close ? 'red' : 'green';
  
  //         // Draw candlestick body
  //         ctx.fillRect(x, candleTop, adjustedColumnWidth - 2 * padding, candleHeight);
  
  //         // Draw candlestick wicks
  //         ctx.beginPath();
  //         ctx.moveTo(x + 0.5 * adjustedColumnWidth, (visibleHighest - item.High) / visibleRange * height);
  //         ctx.lineTo(x + 0.5 * adjustedColumnWidth, (visibleHighest - item.Close) / visibleRange * height);
  //         ctx.stroke();
  
  //         ctx.beginPath();
  //         ctx.moveTo(x + 0.5 * adjustedColumnWidth, (visibleHighest - item.Low) / visibleRange * height);
  //         ctx.lineTo(x + 0.5 * adjustedColumnWidth, (visibleHighest - item.Open) / visibleRange * height);
  //         ctx.stroke();
  
  //         currentIndex++;
  //     });
  // }
  

//     render() {
//         return (
//             <div style={{position: "relative"}}>
//               <div
//                 ref={this.containerRef}
//                 style={{ overflowX: 'auto', width: '100%' }}
//                 onScroll={this.handleScroll}
//                 onWheel={this.handleWheel}
//               >
//                   <canvas ref={this.canvasRef} width={800} height={400}></canvas>
//                   <div ref={this.labelsContainerRef} style={{ position: 'absolute', top: 0, right: 0 }}></div>
//               </div>
//             </div>
//         );
//     }
// }

// export default ForexChart;


//v-2 

import React, { Component, WheelEventHandler } from 'react';

interface Item {
    Time: number;
    Open: number;
    High: number;
    Low: number;
    Close: number;
}

interface ChartProps {
    data: Item[];
}

interface ChartState {
    scale: number;
}

class Chart extends Component<ChartProps, ChartState> {
    constructor(props: ChartProps) {
        super(props);
        this.state = {
            scale: 1,
        };
    }

    containerRef = React.createRef<HTMLDivElement>();
    canvasRef = React.createRef<HTMLCanvasElement>();
    labelsContainerRef = React.createRef<HTMLDivElement>();

    componentDidMount() {
        // Attach scroll event listener to the container element
        const container = this.containerRef.current!;
        container.addEventListener('scroll', this.handleScroll);
    }

    componentWillUnmount() {
        // Remove scroll event listener when the component unmounts
        const container = this.containerRef.current!;
        container.removeEventListener('scroll', this.handleScroll);
    }

    handleScroll = () => {
        // Call drawChart function when scrolling occurs
        this.drawChart();
    }

    handleWheel: WheelEventHandler<HTMLDivElement> = (event) => {
        // event.preventDefault();
        const { deltaY } = event;
        const { scale } = this.state;
        const newScale = deltaY > 0 ? scale * 0.9 : scale * 1.1;
        this.setState({ scale: newScale });
    }

    drawChart() {
        const { data } = this.props;
        const { scale } = this.state;
        const canvas = this.canvasRef.current!;
        const ctx = canvas.getContext('2d')!;
        const height = canvas.height;

        // Find highest and lowest values for scaling
        const highs = data.map(item => item.High);
        const lows = data.map(item => item.Low);
        const highest = Math.max(...highs);
        const lowest = Math.min(...lows);
        const range = highest - lowest;

        // Calculate candle width and padding
        const numColumns = data.length;
        const minColumnWidth = 0.5; // Adjust the minimum width as needed
        let columnWidth = (800 * 0.8) / numColumns * scale;
        const adjustedColumnWidth = Math.max(minColumnWidth, columnWidth);
        const padding = 0.2 * adjustedColumnWidth; // Adjust padding as needed

        // Calculate the total width of the chart
        const totalWidth = numColumns * adjustedColumnWidth;

        // Set canvas width to the total width plus padding to ensure space for scrollbar
        canvas.width = totalWidth + 30;

        // Calculate the index of the first visible item
        const container = this.containerRef.current!;
        const firstVisibleIndex = Math.max(0, Math.floor(container.scrollLeft / adjustedColumnWidth));

        // Calculate the index of the last visible item
        const lastVisibleIndex = Math.min(numColumns - 1, Math.ceil((container.scrollLeft + 800) / adjustedColumnWidth));

        // Calculate the range of data currently visible
        const visibleData = data.slice(firstVisibleIndex, lastVisibleIndex + 1);
        const visibleHighs = visibleData.map(item => item.High);
        const visibleLows = visibleData.map(item => item.Low);
        const visibleHighest = Math.max(...visibleHighs);
        const visibleLowest = Math.min(...visibleLows);
        const visibleRange = visibleHighest - visibleLowest;

        // Draw y-axis labels on the right side
        const labelsContainer = this.labelsContainerRef.current!;
        labelsContainer.innerHTML = '';
        const numLabels = 15;
        const labelInterval = visibleRange / (numLabels - 1);
        for (let i = 0; i < numLabels; i++) {
            const label = visibleLowest + i * labelInterval;
            const y = ((label - visibleLowest) / visibleRange) * height;
            const labelElement = document.createElement('div');
            labelElement.textContent = label.toFixed(5);
            labelElement.style.position = 'absolute';
            labelElement.style.right = '0';
            labelElement.style.top = y + 'px';
            labelElement.style.background = 'white'; // Set background color to white
            labelsContainer.appendChild(labelElement);
        }

        // Draw horizontal gridlines
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#ccc';
        ctx.lineWidth = 0.5;
        for (let i = 0; i < numLabels; i++) {
            const y = ((visibleLowest + i * labelInterval - visibleLowest) / visibleRange) * height;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(totalWidth, y);
            ctx.stroke();
        }

        // Variable to keep track of current index
        let currentIndex = firstVisibleIndex;

        // Draw candles
        visibleData.forEach(item => {
            const x = currentIndex * adjustedColumnWidth + padding; // Adjust x position based on scale
            const candleHeight = (item.High - item.Low) / visibleRange * height;
            const candleTop = (visibleHighest - item.High) / visibleRange * height;

            ctx.strokeStyle = item.Open > item.Close ? 'red' : 'green';
            ctx.fillStyle = item.Open > item.Close ? 'red' : 'green';

            // Draw candlestick body
            ctx.fillRect(x, candleTop, adjustedColumnWidth - 2 * padding, candleHeight);

            // Draw candlestick wicks
            ctx.beginPath();
            ctx.moveTo(x + 0.5 * adjustedColumnWidth, (visibleHighest - item.High) / visibleRange * height);
            ctx.lineTo(x + 0.5 * adjustedColumnWidth, (visibleHighest - item.Close) / visibleRange * height);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(x + 0.5 * adjustedColumnWidth, (visibleHighest - item.Low) / visibleRange * height);
            ctx.lineTo(x + 0.5 * adjustedColumnWidth, (visibleHighest - item.Open) / visibleRange * height);
            ctx.stroke();

            currentIndex++;
        });
    }
    
    render() {
        return (
            <div style={{position: "relative", width: '800px'}}>
              <div ref={this.containerRef} style={{ overflowX: 'scroll', width: '800px', height: '400px' }} onWheel={this.handleWheel}>
                <canvas ref={this.canvasRef} width={800} height={400}></canvas>
                <div ref={this.labelsContainerRef} style={{ position: 'absolute', right: '0', top: '0', bottom: '0', display: 'flex', flexDirection: 'column' }}></div>
            </div>
            </div>
        );
    }
}

export default Chart;
