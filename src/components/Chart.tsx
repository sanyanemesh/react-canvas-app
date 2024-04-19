import React, { Component, WheelEventHandler } from 'react';

interface Item {
    Time: string;
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
    isDragging: boolean,
    dragStartX: number,
    scrollStartX: number,
}

class Chart extends Component<ChartProps, ChartState> {
    debounceTimeout: NodeJS.Timeout | null = null; // Store debounce timeout

    constructor(props: ChartProps) {
        super(props);
        this.state = {
            scale: 1,
            isDragging: false,
            dragStartX: 0,
            scrollStartX: 0,
        };
    }

    containerRef = React.createRef<HTMLDivElement>();
    canvasRef = React.createRef<HTMLCanvasElement>();
    labelsContainerRef = React.createRef<HTMLDivElement>();
    xAxisContainerRef = React.createRef<HTMLDivElement>(); // Container for x-axis labels

    componentDidMount() {
        // Attach scroll event listener to the container element
        const container = this.containerRef.current!;
        container.addEventListener('scroll', this.handleScrollDebounced);
        const canvas = this.canvasRef.current!;
        canvas.addEventListener('mousedown', this.handleMouseDown);
        canvas.addEventListener('mousemove', this.handleMouseMove);
        canvas.addEventListener('mouseup', this.handleMouseUp);
        this.drawChart();
    }

    componentDidUpdate() {
        this.drawChart();
    }

    componentWillUnmount() {
        // Remove scroll event listener when the component unmounts
        const container = this.containerRef.current!;
        container.removeEventListener('scroll', this.handleScrollDebounced);
        const canvas = this.canvasRef.current!;
        canvas.removeEventListener('mousedown', this.handleMouseDown);
        canvas.removeEventListener('mousemove', this.handleMouseMove);
        canvas.removeEventListener('mouseup', this.handleMouseUp);
    }

    handleScrollDebounced = () => {
        if (this.debounceTimeout) {
            clearTimeout(this.debounceTimeout);
        }
        this.debounceTimeout = setTimeout(this.drawChart, 100); // Debounce time
    }

    handleWheel: WheelEventHandler<HTMLDivElement> = (event) => {
        const { deltaY } = event;
        const { scale } = this.state;
        const newScale = deltaY > 0 ? scale * 0.9 : scale * 1.1;
        this.setState({ scale: newScale });
    }
    handleMouseDown = (event: MouseEvent) => {
        const { clientX } = event;
        this.setState({
            isDragging: true,
            dragStartX: clientX,
            scrollStartX: this.containerRef.current!.scrollLeft,
        });
    }

    handleMouseMove = (event: MouseEvent) => {
        const { isDragging, dragStartX, scrollStartX } = this.state;
        if (isDragging) {
            const { clientX } = event;
            const deltaX = clientX - dragStartX;
            this.containerRef.current!.scrollLeft = scrollStartX - deltaX;
        }
    }

    handleMouseUp = () => {
        this.setState({ isDragging: false });
    }

    drawChart = () => {
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
    
        // Calculate the bottom position for time labels
        const bottomPosition = height + 20; // Adjust as needed
    
        // Calculate label frequency based on visible range and desired label count
        const visibleLabelCount = 7;
        const labelFrequency = Math.max(1, Math.ceil(visibleData.length / visibleLabelCount));
    
        // Draw time labels on x-axis
        const xAxisContainer = this.xAxisContainerRef.current!;
        xAxisContainer.innerHTML = '';
        ctx.font = '10px Arial';
        ctx.fillStyle = 'black';
        for (let i = 0; i < visibleData.length; i += labelFrequency) {
            const item = visibleData[i];
            const x = (firstVisibleIndex + i) * adjustedColumnWidth + padding - container.scrollLeft; // Adjusted for scroll position
            const labelElement = document.createElement('div');
            labelElement.textContent = item.Time;
            labelElement.style.position = 'absolute';
            labelElement.style.left = x + 'px';
            labelElement.style.bottom = '0';
            labelElement.style.background = 'white'; // Set background color to white
            xAxisContainer.appendChild(labelElement); // Append label to x-axis container
        }

    
        // Variable to keep track of current index
        let currentIndex = firstVisibleIndex;
    
        // Draw candles
        visibleData.forEach(item => {
            const x = currentIndex * adjustedColumnWidth + padding; // Adjust x position based on scale
            const candleHeight = (item.High - item.Low) / visibleRange * height;
            const candleTop = (visibleHighest - item.High) / visibleRange * height;
    
            // Draw candlestick body
            ctx.strokeStyle = item.Open > item.Close ? 'red' : 'green';
            ctx.fillStyle = item.Open > item.Close ? 'red' : 'green';
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

            // Draw high and low lines
            const highY = ((visibleHighest - item.High) / visibleRange) * height;
            const lowY = ((visibleHighest - item.Low) / visibleRange) * height;
            ctx.beginPath();
            ctx.moveTo(x + 0.15 * adjustedColumnWidth, highY);
            ctx.lineTo(x + 0.85 * adjustedColumnWidth, highY);
            ctx.moveTo(x + 0.5 * adjustedColumnWidth, highY);
            ctx.lineTo(x + 0.5 * adjustedColumnWidth, lowY);
            ctx.moveTo(x + 0.15 * adjustedColumnWidth, lowY);
            ctx.lineTo(x + 0.85 * adjustedColumnWidth, lowY);
            ctx.stroke();
    
            // Draw high and low labels
            ctx.fillText('H', x + 0.9 * adjustedColumnWidth, highY - 5);
            ctx.fillText('L', x + 0.9 * adjustedColumnWidth, lowY + 15);
    
            currentIndex++;
        });
    }
    
    

    render() {
        return (
            <div style={{ position: "relative", width: '800px' }}>
                <div ref={this.containerRef} style={{ overflowX: 'scroll', width: '800px', height: '400px' }} onWheel={this.handleWheel}>
                    <canvas ref={this.canvasRef} width={800} height={400}></canvas>
                    <div ref={this.labelsContainerRef} style={{ position: 'absolute', right: '0', top: '0', bottom: '0', display: 'flex', flexDirection: 'column' }}></div>
                    <div ref={this.xAxisContainerRef} style={{ position: 'absolute', left: '0', right: '0', bottom: '0', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}></div>
                </div>
            </div>
        );
    }
}

export default Chart;
