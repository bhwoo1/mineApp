"use client"


const Product = (props: {
    params: {auctionid: number}
}) => {

    return(
        <main className="flex min-h-screen flex-col items-center justify-between pt-24">
            <h1>{props.params.auctionid}</h1>
        </main>
    )
}


export default Product;