import { CommentInfo } from "@/app/Type";
import axios from "axios";
import { useSession } from "next-auth/react";
import React, { useState, ChangeEvent, useEffect } from "react";


type Props = {
    auctionid: number,
    auctionuser: string
}


const Comment = (props: Props) => {
    const [comments, setComments] = useState<CommentInfo[]>([]);
    const [newComment, setNewComment] = useState<string>("");
    const [editComment, setEditComment] = useState<string>("");
    const [replyComment, setReplyComment] = useState<string>("");
    const [replyCommentFor, setReplyCommentFor] = useState<number | null>(null);
    const [editCommentMode, setEditCommentMode] = useState<number | null>(null); // 수정할 댓글의 ID 상태 추가
    const {data: session} = useSession();

    useEffect(() => {
        const formData = new FormData();
        formData.append("boardid", String(props.auctionid));

        axios.post("http://localhost:8080/comment/read", formData, {
            withCredentials: true
        })
        .then((res) => {
            // console.log(res.data);
            setComments(res.data);
        })
        .catch((err) => {
            console.log(err);
        })
    }, []);

    const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setNewComment(event.target.value);
    };

    const handleEditChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setEditComment(event.target.value);
    };

    const handleReplyInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setReplyComment(event.target.value);
    }

    const handleSubmit = () => {
        const currentTime = new Date();
        const formData = new FormData();
        formData.append("boardid", String(props.auctionid));
        formData.append("content", replyCommentFor ? replyComment.replace(/\n/g, "§") : newComment.replace(/\n/g, "§"));
        formData.append("username", String(session?.user.name));
        formData.append("parentcomment", String(replyCommentFor || 0)); // If replyCommentFor exists, use it as parentcomment, otherwise use 0
        formData.append("commentid", String(comments.length + 1));
        formData.append("datetime", String(currentTime));
        formData.append("user", String(session?.user.email));
    
        axios.post("http://localhost:8080/comment/write", formData, {
            withCredentials: true
        })
        .then((res) => {
            console.log(res.data);
            alert("댓글 작성이 완료되었습니다.");
            window.location.reload();
        })
        .catch((err) => {
            console.log(err);
            alert("댓글 작성에 실패하였습니다.");
        });
    };

    const deleteComment = (commentid: number, username: string) => {
        axios.delete(`http://localhost:8080/comment/delete/${commentid}`, {
            params: {
                username: username
            },
            withCredentials: true
        })
        .then((res) => {
            alert('댓글을 삭제했습니다.');
            window.location.reload();
        })
        .catch((err) => {
            console.log(err);
        })
    };

    const updateComment = (comment:CommentInfo) => {
        const currentTime = new Date();
        const formData = new FormData();
        formData.append("commentid", String(comment.commentid));
        formData.append("boardid", String(props.auctionid));
        formData.append("content", replyCommentFor ? replyComment.replace(/\n/g, "§") : editComment.replace(/\n/g, "§"));
        formData.append("user", String(session?.user.email));
        formData.append("username", String(session?.user.name));
        formData.append("parentcomment", String(replyCommentFor || 0));
        formData.append("datetime", String(currentTime));

        axios.put(`http://localhost:8080/comment/update/${comment.commentid}`, formData, {
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
        })
        .then((res) => {
            alert('댓글을 수정했습니다.');
            window.location.reload();
        })
        .catch((err) => {
            alert('수정에 실패했습니다.');
            console.log(err);
        })
    };

    return (
        <div className="mt-4">
            <p className="pb-4">판매자에게 물어보고 싶은 사항을 입력해주세요.</p>
            <ul className="space-y-4">
                {comments.filter(comment => comment.parentcomment === "0").map((comment) => {
                    const isChildComment = (childComment: CommentInfo) => {
                        return Number(childComment.parentcomment) === comment.commentid;
                    };

                    return (
                        <li key={comment.commentid} className="border border-gray-300 p-4 rounded-md">
                            <div className="flex justify-between items-center">
                                <div>
                                    <span className="font-semibold">{comment.username}</span>
                                    <span className="text-gray-500 text-sm ml-2">{comment.datetime[0] + "." + comment.datetime[1] + "." + comment.datetime[2] + ". " + comment.datetime[3] + ":" + comment.datetime[4]}</span>
                                </div>
                                {comment.user === session?.user.email && (
                                    <div className="flex">
                                        {/* 수정 버튼 클릭 시 editCommentMode 상태를 해당 댓글의 ID로 설정 */}
                                        <button className="px-3 py-1 text-sm" onClick={() => {setEditCommentMode(comment.commentid), setEditComment(comment.content.replace(/§/g, "\n"))}}>수정</button>
                                        <button className="px-3 py-1 text-sm" onClick={() => deleteComment(comment.commentid, comment.username)}>삭제</button>
                                    </div>
                                )}
                            </div>
                            {/* 수정할 댓글의 내용을 표시하는 textarea는 editCommentMode가 해당 댓글의 ID와 일치할 때 표시 */}
                            {(editCommentMode === comment.commentid) ? (
                                <div>
                                    <textarea
                                        value={editComment}
                                        onChange={handleEditChange}
                                        placeholder="댓글을 입력하세요..."
                                        className="mt-4 p-2 border border-gray-300 rounded-md w-full"
                                    />
                                    <button onClick={() => updateComment(comment)} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">수정 완료</button>
                                </div>
                            ) : (
                                <p className="mt-2 pb-4">
                                    {comment.content && comment.content.split('§').map((line, index) => (
                                        <React.Fragment key={index}>
                                            {line}
                                            <br />
                                        </React.Fragment>
                                    ))}
                                </p>
                            )}

                            {props.auctionuser === session?.user.email && (
                                <button className="px-3 py-1 text-sm border-2 border-gray-100 m-4" onClick={() => setReplyCommentFor(comment.commentid)}>답글</button>
                            )} 

                            {/* 답글 폼 */}
                            {replyCommentFor === comment.commentid && (
                                <div className="border border-gray-300 p-4 rounded-md">
                                    <textarea
                                        value={replyComment}
                                        onChange={handleReplyInputChange}
                                        placeholder="답변을 입력하세요..."
                                        className="mt-4 p-2 border border-gray-300 rounded-md w-full"
                                    />
                                    <button onClick={handleSubmit} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">답변 추가</button>
                                </div>
                            )}

                            {/* 답글 표시 */}
                            {comments.filter(isChildComment).map((childComment) => (
                                <div key={childComment.commentid} className="border border-gray-300 p-4 rounded-md ml-8">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <span className="font-semibold">{childComment.username}</span>
                                            <span className="text-gray-500 text-sm ml-2">{childComment.datetime[0] + "." + childComment.datetime[1] + "." + childComment.datetime[2] + ". " + childComment.datetime[3] + ":" + childComment.datetime[4]}</span>
                                        </div>
                                        {childComment.user === session?.user.email && (
                                            <div className="flex">
                                                <button className="px-3 py-1 text-sm">수정</button>
                                                <button className="px-3 py-1 text-sm" onClick={() => deleteComment(childComment.commentid, childComment.username)}>삭제</button>
                                            </div>
                                        )}
                                    </div>
                                    <p className="mt-2">
                                        {childComment.content && childComment.content.split('§').map((line, index) => (
                                            <React.Fragment key={index}>
                                            {line}
                                            <br />
                                            </React.Fragment>
                                        ))}
                                    </p>
                                </div>
                            ))}
                        </li>
                    );
                })}
            </ul>
            {session?.user.email && props.auctionuser != session?.user.email && (
                <div>
                    <textarea
                        value={newComment}
                        onChange={handleInputChange}
                        placeholder="댓글을 입력하세요..."
                        className="mt-4 p-2 border border-gray-300 rounded-md w-full"
                    />
                    <button onClick={handleSubmit} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">댓글 추가</button>
                </div>
            )}
            
        </div>
    );
};

export default Comment;