export type Product =  {
    auctionimages: File[];
    auctiontitle: string;
    auctionprice: number;
    auctioncontent: string;
    auctiontime: Date;
    auctionendtime: Date;
    auctionuser: string;
    auctioncategory: string;
    auctiondirectbid: number | null;
    auctionusername: string;
  }

 export type ProductInfo = {
    auctionid: number, 
    auctiontitle: string,
    auctioncontent: string,
    auctionuser: string,
    auctionendtime: string,
    auctionimageurl: string[],
    auctionprice: string,
    auctiontime:string,
    auctiondirectbid: number | null,
    auctionimage: null,
    auctionbidder: null,
    auctioncategory: string,
    auctionfirsturl: string | null,
    auctionimages: File[],
    auctionusername: string,
    auctionbidsnum: number,
    auctionbidprice: string
  }

  export type CommentInfo = {
    boardid: number,
    commentid: number,
    content: string,
    username: string,
    user: string,
    datetime: number[],
    parentcomment: string
}