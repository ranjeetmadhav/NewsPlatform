import React, { Component } from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner';
import PropTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component";


export class News extends Component {

  static defaultProps ={
    country: 'in',
    pageSize: 8,
    category: 'general'
  }
  static propsTypes ={
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
   
    constructor(props){
        super(props);
        this.state ={
            articles: [],
            loading: true,
            page:1,
            totalResults:0
          }
          document.title = `${this.capitalizeFirstLetter(this.props.category)} - NewsLizard`;
    }

    async updateNews(){
      console.log("i am in uN");
      this.props.setProgress(10);
      const url=`https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page}&pageSize=${this.props.pageSize}`;
      this.setState({loading: true});
      let data = await fetch(url);
      this.props.setProgress(30);
      let parsedData =await data.json();
      this.props.setProgress(50);
      console.log(parsedData);
      this.setState({articles: parsedData.articles , totalResults: parsedData.totalResults,
      loading:false})
      this.props.setProgress(100);

    }

    async componentDidMount(){
      this.updateNews();
      console.log("i am in cdm");
  
    }

    handleNextclick = async()=>{
     
      this.setState({page: this.state.page +1});
      this.updateNews();
    }

     handlePrevclick= async()=>{
      
      this.setState({page: this.state.page -1});
      this.updateNews();
    }
    fetchMoreData = async() => {
      
      this.setState({page: this.state.page+1});
        
        const url=`https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page+1}&pageSize=${this.props.pageSize}`;
        
        let data = await fetch(url);
        let parsedData =await data.json();
        console.log(parsedData);
        this.setState({
          articles: this.state.articles.concat(parsedData.articles) , totalResults: parsedData.totalResults,
        loading:false})
      
    };

  render() {
    return (
      <>
        <h1 className="text-center my-5">NewsLizard - Top {this.capitalizeFirstLetter(this.props.category)} Headlines</h1>
          { this.state.loading && <Spinner/>}
        <InfiniteScroll dataLength={this.state.articles.length}
          next={this.fetchMoreData}
          hasMore={this.state.articles.length !== this.state.totalResults}
          loader={<Spinner/>}
        >
          <div className="container">

        <div className="row">
        {this.state.articles.map((element)=>{
            return <div className="col-md-3" key={element.url}>
                      <NewsItem key={element.url} title={element.title?element.title.slice(0,20):''} description= {element.description?element.description.slice(0,50):""} imageUrl={element.urlToImage} newsUrl={element.url} author={!element.author?"Unknown":element.author} date={element.publishedAt} source={element.source.name}/>
                   </div>
            })}
          </div>
          </div>
          </InfiniteScroll>
        
      </>
    )
  }
}

export default News
