import { Component } from 'react';
import { fetchData, formatTime, hasMissingValues, Item } from './helpers';
import SelectButtons from './components/ButtonSelect';
import './App.css';
import Chart from './components/Chart';

interface MyComponentProps {}

interface DataItem {
  ChunkStart: number;
  Bars: any[];
}

interface MyComponentState {
  data: DataItem[] | null;
  chunkStartValues: number[];
  loading: boolean | null;
  error: string | null;
  selectedPair: string | null
  selectedDate: number | null
}

class App extends Component<MyComponentProps, MyComponentState> {
  constructor(props: MyComponentProps) {
    super(props);
    this.state = {
      data: null,
      chunkStartValues: [],
      loading: null,
      error: null,
      selectedPair: null,
      selectedDate: null
    };
  }

  async componentDidUpdate( prevProps: MyComponentProps, prevState: MyComponentState) {
    if(this.state.selectedPair !== prevState.selectedPair && this.state.selectedPair) {
      this.setState({ loading:true, data: null, selectedDate:null });
      try {
        const { data, error } = await fetchData<DataItem[]>(this.state.selectedPair);
        if (data) {
          const chunkStartValues = data.map(item => item.ChunkStart);
          this.setState({ data, chunkStartValues, loading:false, error });
        } else {
          this.setState({ loading:false, error });
        }
      } catch (error:any) {
        this.setState({ loading: false, error: error.message });
      }
    }
  }

  updateSelectedPair = (newState: string) => {
    this.setState({ selectedPair: newState });
  };

  updateSelectedDate = (newState: number) => {
    this.setState({ selectedDate: newState });
  };
  prepareData = () => {
    const { data, selectedDate } = this.state;
    let index = data?.findIndex((obj:any) => obj.ChunkStart === selectedDate)
    let prepared = data && index && data[index];
    if(index === 0) prepared = data && data[0]
    return prepared
  }
  timeConverted = () => {
    let data = this.prepareData();
    let result = data && data.Bars.map((item:Item) => {
      const formattedTime: string = formatTime(item.Time);
      return { ...item, Time: formattedTime };
    })
    return result
  }

  render() {
    const { chunkStartValues, loading, error, selectedDate, selectedPair } = this.state;
    if(error) return <>Something went wrong ...</>
    let prepared = this.timeConverted()
    console.log("prepared len", prepared && prepared?.length)

    return (
      <div className='container'>
        {!selectedPair && <div>Please select currency Pair</div>}
        <SelectButtons options={['EURUSD','USDJPY']} updateSelectedPair={this.updateSelectedPair}/>
        {loading && <div className='loading-spinner' />}
        {chunkStartValues.length > 0 && 
          <>
            {!selectedDate && <div>Please select available date</div>}
            <SelectButtons options={chunkStartValues} updateSelectedDate={this.updateSelectedDate}/>
          </>
        }
        {prepared && (
          <div>
            <h2>Chart with selected data</h2>
              <Chart data={prepared} />
            </div>
        )}
      </div>
    );
  }
}
export default App;
