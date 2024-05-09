export type Product =  {
    auctionimages: File[];
    auctiontitle: string;
    auctionprice: number;
    auctioncontent: string;
    auctiontime: Date;
    auctionendtime: Date;
    auctionuser: string;
    auctioncategory: string;
    auctiondirectbid: number;
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
    auctiondirectbid: number,
    auctionimage: null,
    auctionbidder: null,
    auctioncategory: string,
    auctionfirsturl: string | null,
    auctionimages: File[],
    auctionusername: string,
    auctionbidsnum: number,
    auctionbidprice: string,
    auctioncomplete: boolean,
    auctionpay: boolean
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