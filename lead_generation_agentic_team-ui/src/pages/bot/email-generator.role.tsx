// import { useState } from "react";
// import {
//   MdAdd,
//   MdArrowDropDown,
//   MdClose,
//   MdFileOpen,
//   MdSearch,
//   MdTerminal,
// } from "react-icons/md";
// import { VscJson, VscTable } from "react-icons/vsc";
// import { twMerge } from "tailwind-merge";
// import { UserRequestForm } from "./components/requestForm";
// import Table from "src/components/ui/table";
// import { BiLoader } from "react-icons/bi";
// import TextResponseView from "./components/response.section";
// import { BsDatabaseFillX } from "react-icons/bs";
// import { TextAnimation } from "src/components/animation";

// const csvData = `S.No,URL,Name,Email,Phone,Status
// 1,https://www.google.com,John Doe,john@doe.com,1234567890,Active 
// 2,https://www.facebook.com,Jane Doe,jane@doe.com,1234567890,Active, 
// 3,https://www.twitter.com,John Smith,john@smith.com,1234567890,Active
// 4,https://www.instagram.com,Jane Smith,jane@smith.com,1234567890,Active
// 5,https://www.linkedin.com,John Doe,john@doe.com,1234567890,Active
// 6,https://www.youtube.com,Jane Doe,jane@doe.com,1234567890,Active
// 7,https://www.tiktok.com,John Smith,john@smith.com,1234567890,Active
// 8,https://www.snapchat.com,Jane Smith,jane@smith.com,1234567890,Active
// 9,https://www.whatsapp.com,John Doe,john@doe.com,1234567890,Active
// 10,https://www.snapchat.com,Jane Smith,jane@smith.com,1234567890,Active
// 11,https://www.tiktok.com,John Smith,john@smith.com,1234567890,Active
// 12,https://www.snapchat.com,Jane Smith,jane@smith.com,1234567890,Active
// 13,https://www.whatsapp.com,John Doe,john@doe.com,1234567890,Active
// 14,https://www.snapchat.com,Jane Smith,jane@smith.com,1234567890,Active
// 15,https://www.tiktok.com,John Smith,john@smith.com,1234567890,Active
// 16,https://www.snapchat.com,Jane Smith,jane@smith.com,1234567890,Active
// 17,https://www.whatsapp.com,John Doe,john@doe.com,1234567890,Active`;

// const jsonData = [
//   {
//     "s.no.": 1,
//     url: "https://www.google.com",
//     name: "John Doe",
//     email: "john@doe.com",
//     phone: "1234567890",
//     status: "Active",
//   },
// ];

// const csvToJson = (csv: string) => {
//   const rows = csv.split("\n").filter((row) => row.trim() !== "");
//   const headers = rows[0].split(",");
//   const data = rows.slice(1).map((row) => {
//     const values = row.split(",");
//     return headers.reduce((acc, header, index) => {
//       acc[header] = values[index];
//       return acc;
//     }, {} as Record<string, string>);
//   });
//   return data;
// };

// const EmailGeneratorRole = () => {
//   const [fileData, setFiledata] = useState<Record<string, string>[]>([]);

//   const handleShowCsvFile = (data: string) => {
//     setFiledata(csvToJson(data));
//   };

//   const handleShowJsonFile = (data: any) => {
//     setFiledata(data);
//   };

//   return (
//     <div className="min-h-screen max-h-screen flex flex-row justify-between">
//       {/* sidebar */}
//       <div
//         className={twMerge(
//           "transition-all duration-300 overflow-hidden relative w-64"
//         )}
//       >
//         <div className="flex flex-row items-center gap-2 p-4 font-cascade bg-green-500/20">
//           <span className="text-green-500 bg-green-500/20 p-1 rounded-md">
//             <MdSearch />
//           </span>
//           <span>Wingman Outreach</span>
//         </div>
//         <div className="flex flex-col gap-2 mt-4 font-cascade">
//           <div className="flex flex-col gap-1 grow">
//             <p className="text-sm w-full flex flex-row items-center uppercase">
//               <span>
//                 <MdArrowDropDown size={24} />
//               </span>
//               <span className="grow">Previous Cold Emails</span>
//             </p>
//             <div className="h-64 text-center flex flex-col items-center justify-center">
//               <span className="text-gray-500">
//                 <BsDatabaseFillX size={24} />
//               </span>
//               <p className="text-gray-500 text-sm">
//                 <TextAnimation text="No Previous Emails" />
//               </p>
//             </div>
//           </div>
//           <div className="flex flex-col gap-1 ">
//             <p className="text-sm w-full flex flex-row items-center uppercase">
//               <span>
//                 <MdArrowDropDown size={24} />
//               </span>
//               <span className="grow">Available Data files</span>
//               <button
//                 title="Add new data file"
//                 className="text-green-500 bg-green-500/20 p-1 rounded-md flex flex-row items-center group mr-2"
//               >
//                 <MdAdd size={16} />
//                 <span className="text-xs w-0 group-hover:w-6 overflow-hidden transition-all duration-300">
//                   Add
//                 </span>
//               </button>
//             </p>
//             <ul className="px-4 gap-1 flex flex-col">
//               {["url.csv", "urls.json"].map((file) => (
//                 <li
//                   key={file}
//                   className="flex flex-row items-center gap-2 text-sm group hover:bg-green-500/20 hover:py-2 px-2 rounded-md"
//                 >
//                   <span className="text-green-500 bg-green-500/20 p-1 rounded-md">
//                     {file.endsWith(".csv") ? <VscTable /> : <VscJson />}
//                   </span>
//                   <span className="text-gray-500 group-hover:text-green-500 grow">
//                     {file}
//                   </span>
//                   <span className="text-gray-500 group-hover:text-green-500 hidden group-hover:block self-center">
//                     <button
//                       onClick={() => {
//                         if (file.endsWith(".csv")) {
//                           handleShowCsvFile(csvData);
//                         } else {
//                           handleShowJsonFile(jsonData);
//                         }
//                       }}
//                       className="p-1 rounded-md hover:bg-green-500/20 flex items-center group/btn"
//                     >
//                       <MdFileOpen size={16} />
//                       <span className="w-0 group-hover/btn:w-7 text-xs overflow-hidden transition-all duration-300">
//                         Open
//                       </span>
//                     </button>
//                   </span>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>
//         <UserRequestForm
//           onSubmit={(data) => {
//             console.log(data);
//           }}
//           disabled={false}
//           inputPrompt="dsdsd"
//         />
//       </div>
//       {/* main content */}
//       <div className="flex-1 bg-white/10 relative p-16 font-cascade">
//         {fileData.length > 0 && (
//           <div className=" min-w-[500px] max-w-[90%] w-fit mx-auto">
//             <div className="flex flex-row items-center justify-between">
//               <p className="text-xl font-cascade py-2 flex flex-row items-center">
//                 <span className="text-green-500 mr-2 bg-green-500/20 p-1 rounded-md">
//                   <MdFileOpen />
//                 </span>{" "}
//                 url.csv
//               </p>
//               <button
//                 onClick={() => {
//                   setFiledata([]);
//                 }}
//                 className="text-green-500 bg-green-500/20 p-1 rounded-md flex flex-row items-center group mr-2"
//               >
//                 <MdClose size={16} />
//                 <span className="w-0 group-hover:w-8 text-xs overflow-hidden transition-all duration-300">
//                   Close
//                 </span>
//               </button>
//             </div>
//             <div className="overflow-x-auto w-fit max-h-[calc(100vh-150px)] rounded-md border border-green-500/20">
//               <Table disable data={fileData} themeColor="green" animate />
//             </div>
//           </div>
//         )}
//         {/* overlay */}
//         <div className="absolute top-0 left-0 w-full h-full bg-green-900/10 flex flex-col backdrop-blur-3xl">
//           <div className="flex flex-row items-center justify-end gap-2 px-4 py-2 text-gray-500 text-sm">
//             <div className="flex flex-row items-center gap-2 grow bg-black/30 rounded-md p-2">
//               <span className="text-green-500 bg-green-500/20 p-1 rounded-md self-start">
//                 <MdTerminal />
//               </span>
//               <span className="self-start line-clamp-1 hover:line-clamp-none">
//                 Please Write a cold email to submit job application for post of
//                 web developer to wintellisys and send it to the following email:
//                 career@wintellisys.com with subject as "Job Application for Web
//                 Developer" and body as "I am a web developer and i want to apply
//                 for the post of web developer at wintellisys"
//               </span>
//             </div>
//             <div className="flex flex-row items-center gap-2 self-start my-2">
//               <BiLoader className="animate-spin" size={20} />
//               {/* <span>Processing...</span> */}
//             </div>
//             <button className="text-red-500 bg-red-500/20 p-1 rounded-md flex flex-row items-center group mr-2 self-start my-2">
//               <MdClose size={16} />
//               <span className="w-0 group-hover:w-8 text-xs overflow-hidden transition-all duration-300">
//                 Stop
//               </span>
//             </button>
//           </div>
//           <div className="flex flex-col gap-4 grow px-4 relative">
//             <div className="flex flex-col justify-top items-center gap-2 w-full max-h-[calc(100vh-114px)] scroll-m-0 overflow-auto">
//               <TextResponseView />
//               {/* Connecting verical line */}
//               {/* Email Generator */}
//               <TextResponseView />

//               <TextResponseView />

//               <TextResponseView isRequestPrompt />

//               <TextResponseView isWaiting />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EmailGeneratorRole;
