import {
  Base_Img_Url,
  RoomsUrl,
  favoriteUrl,
} from "../../../../constants/End_Points";
import {
  Box,
  Container,
  Grid2,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Pagination,
  Tooltip,
  Typography,
} from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";

import { AuthContext } from "../../../../context/authcontext";
import FavoriteIcon from "@mui/icons-material/Favorite";
import HeaderUserRoom from "../../../Shared/components/HeaderUserRoom/HeaderUserRoom";
import NoData from "../../../Shared/components/NoData/NoData";
import VisibilityIcon from "@mui/icons-material/Visibility";
import axios from "axios";
import { format } from "date-fns";
import { toast } from "react-toastify";

export default function AllRooms() {
  let { loginData }: any = useContext(AuthContext);
  let navigate = useNavigate();
  let location = useLocation();

  // Handle the incoming values from location.state
  const { startDate, endDate, capacity } = location.state || {};

  const [roomList, setRoomList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  const handleRoomClick = (
    roomId: string,
    capacity?: number,
    startDate?: string,
    endDate?: string
  ) => {
    // Navigate with roomId, and pass only if values are defined
    navigate(`/dashboard/room-details/${roomId}`, {
      state: {
        capacity: capacity || 2, // Default to 2 if not provided
        startDate: startDate || format(new Date(), "yyyy-MM-dd"), // Default to today
        endDate: endDate || format(new Date(), "yyyy-MM-dd"), // Default to today
      },
    });
  };

  // Fetch all rooms with optional startDate, endDate, and capacity
  let getAllRoom = async (page: number) => {
    try {
      let response = await axios.get(`${RoomsUrl.getAllRoom}/available`, {
        params: {
          page: page + 1,
          size: pageSize,
          startDate: startDate
            ? format(new Date(startDate), "yyyy-MM-dd")
            : format(new Date(), "yyyy-MM-dd"),
          endDate: endDate
            ? format(new Date(endDate), "yyyy-MM-dd")
            : format(new Date(), "yyyy-MM-dd"),
          capacity: capacity || 2, // Default capacity to 2
        },
      });

      setRoomList(response.data.data.rooms);
      setTotalCount(response.data.data.totalCount);
      setTotalPages(Math.ceil(response.data.data.totalCount / pageSize));

      console.log(response.data.data.rooms);
    } catch (error: any) {
      console.log("Failed to fetch rooms", error);
    }
  };

  useEffect(() => {
    getAllRoom(page);
  }, [page, startDate, endDate, capacity]);

  let addToFav = async (id: string) => {
    try {
      let response = await axios.post(
        favoriteUrl.add,
        { roomId: id },
        {
          headers: { Authorization: localStorage.getItem("token") },
        }
      );

      toast.success(" Successfully Added To Favorites ");
      console.log(response);
    } catch (error: any) {
      if (loginData?.role === "user") {
        toast.error("Failed to add to Favorites");
      } else {
        toast.error("You need to login to add a room to Favorites");
      }
    }
  };

  useEffect(() => {
    getAllRoom(page);
    setTotalPages(Math.ceil(totalCount / pageSize));
  }, [totalPages]);

  return (
    <>
      <Box>
        {roomList.length > 0 ? (
          <Container>
            <HeaderUserRoom
              title={"Explore ALL Rooms"}
              linkTo={"all-rooms"}
              NameLink={"Explore"}
              Name={"ALL Rooms"}
            />

            <Grid2 container>
              {roomList.map((room: any) => (
                <Grid2
                  size={{ xs: 12, sm: 6, md: 4 }}
                  sx={{ my: 2 }}
                  key={room._id}
                >
                  <Box
                    className="ImgList "
                    sx={{ height: "215px", width: "90%" }}
                  >
                    <Box sx={{ position: "relative" }}>
                      <Box
                        component="img"
                        alt="img-room"
                        src={room?.images[0]}
                        sx={{
                          height: "215px",
                          borderRadius: "15px",
                          width: "100%",
                        }}
                      />
                      <Box className="headerImg">
                        <Typography>
                          {"$" + room.price + "" + " per night"}
                        </Typography>
                      </Box>
                    </Box>
                    <Box className="LayerIcon">
                      <Box className="IconsBar">
                        <Tooltip title="Details Room">
                          <VisibilityIcon
                            fontSize="large"
                            onClick={() =>
                              handleRoomClick(
                                room._id,
                                capacity,
                                startDate,
                                endDate
                              )
                            }
                          />
                        </Tooltip>

                        <Tooltip title="Add To Favorite">
                          <FavoriteIcon
                            fontSize="large"
                            onClick={() => addToFav(room._id)}
                            sx={{ marginLeft: "15px" }}
                          />
                        </Tooltip>
                      </Box>
                    </Box>
                  </Box>
                </Grid2>
              ))}
            </Grid2>

            {/* <ImageList cols={3} sx={{ width: "100%" }}>
      
          {roomList.map((room: any) => (
           
              <ImageListItem className="ImgList" key={room._id} sx={{ m: 2 }}>
                <ImageListItemBar
                  title={"$" + room.price + "" +" per night"}
                  position="top"
                  sx={{
                    textAlign: "center",
                    display:"flex",
                    justifyContent:"end",
                    borderTopRightRadius: "15px",
                    borderBottomLeftRadius: "15px",            
                    left:{xs:"35%",md:"50%"},
                    width:{xs:"85%",md:"50%"},
                    fontWeight:500,
                    backgroundColor:"#FF498B",
                    fontSize:{xs:"6px", sm:"13px",md:"16px"}
                  }}
                />
   
              <Box component="img"
                  alt="img-room"
                  src={room?.images[0]}
                  loading="lazy"
                  sx={{
                  
                    height:{xs:"120px",sm:"160px",md:"215px"},
                    borderRadius: "15px",
                    width:"100%",
                    
                  }}
                />

                <Box className="LayerIcon">
                  <Box className="IconsBar">
<Tooltip title="Details Room">
<VisibilityIcon fontSize="large" onClick={()=>navigate(``)}/>
</Tooltip>
<Tooltip title="Add To Favorite">
<FavoriteIcon fontSize="large" onClick={()=>addToFav(room._id)} sx={{marginLeft:"15px"}}/>
</Tooltip>
 
               
                  </Box>


                </Box>

              </ImageListItem>
           
          ))}
        </ImageList> */}

            {/* <Box  sx={{display:"flex", justifyContent:"center", my:4, height:"30%"}}>
      <Pagination page={page} count={totalPages} onChange={(e, value) => setPage(value)} color="primary" variant="outlined" shape="rounded"  />
     
    </Box>  */}
          </Container>
        ) : (
          <NoData />
        )}
      </Box>
    </>
  );
}
