import React, { Component } from "react";

interface DataItem {
  Time: number;
  Open: number;
  High: number;
  Low: number;
  Close: number;
  TickVolume: number;
}

interface Props {
  data: DataItem[];
  width: number;
  height: number;
}

interface State {
  scale: number;
}

class CanvasChart extends Component<Props, State> {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  containerRef: React.RefObject<HTMLDivElement>;

  constructor(props: Props) {
    super(props);
    this.canvasRef = React.createRef();
    this.containerRef = React.createRef();
    this.state = {
      scale: 1,
    };
  }

  componentDidMount() {
    this.drawChart();
    const ctx = this.canvasRef.current?.getContext("2d");
    if (ctx) {
      ctx.font = "12px Arial";
    }
    this.addMouseWheelListener();
  }

  componentDidUpdate() {
    this.drawChart();
  }

  addMouseWheelListener() {
    const container = this.containerRef.current;
    if (!container) return;

    container.addEventListener("wheel", this.handleMouseWheel);
  }

  handleMouseWheel = (event: WheelEvent) => {
    event.preventDefault();

    const container = this.containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const scaleChange = event.deltaY > 0 ? -0.1 : 0.1;

    this.setState(prevState => {
      const newScale = Math.max(0.1, prevState.scale + scaleChange);
      return { scale: newScale };
    });
  };

  drawChart() {
    const canvas = this.canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { data, width, height } = this.props;
    const { scale } = this.state;

    ctx.clearRect(0, 0, width, height);

    const priceScale = (height / scale) / (Math.max(...data.map(item => item.High)) - Math.min(...data.map(item => item.Low)));

    const barWidth = (width / data.length) * scale;

    data.forEach((item, index) => {
      const x = index * barWidth;
      const yOpen = ((item.High - item.Open) * priceScale) * scale;
      const yClose = ((item.High - item.Close) * priceScale) * scale;
      const yHigh = ((item.High - item.High) * priceScale) * scale;
      const yLow = ((item.High - item.Low) * priceScale) * scale;

      ctx.fillStyle = item.Close > item.Open ? "green" : "red";
      ctx.fillRect(x, yOpen, barWidth, yClose - yOpen);
      ctx.fillRect(x + barWidth / 2 - 1, yHigh, 2, yLow - yHigh);

      // Draw scale numbers
      const scaleText = `${item.High.toFixed(2)}`;
      ctx.fillStyle = "black";
      ctx.fillText(scaleText, width - 40, yHigh + 10);
    });
  }

  render() {
    const { width, height } = this.props;
    return (
      <div
        ref={this.containerRef}
        style={{ width: "100%", height: "100%", overflowX: "auto", overflowY: "hidden" }}
      >
        <canvas
          ref={this.canvasRef}
          width={width}
          height={height}
          style={{ transform: `scale(${this.state.scale})`, transformOrigin: "left top" }}
        />
      </div>
    );
  }
}

export default CanvasChart;
