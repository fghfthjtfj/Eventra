import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header/header";
import Footer from "./components/Footer/footer";
import Main from "./components/Main/main";
import CategorySearch from "./components/CategorySearch/categorysearch";
import CatalogArtist from "./components/CatalogArtist/catalogartist";
import CatalogApplications from "./components/CatalogApplications/catalogapplications";
import ApplicationDetails from "./components/ApplicationDetails/ApplicationDetails";
import { useUser } from "./context/userContext";
import ArtistDetails from "./components/ArtistDetail/artistDetails";
import AddApplication from "./components/AddApplication/addApplication";
import ApplicationDone from "./components/ApplicationDone/applicationDone";
import MyApplications from "./components/Profile/myApplications";
import AddMyApplication from "./components/Profile/addMyApplication";
import AddArtistRequest from "./components/AddArtistRequest/addArtistRequest";
import DoneArtistRequest from "./components/AddArtistRequest/doneArtistRequest";
import MyRequest from "./components/Profile/myRequests";
import AddMyRequest from "./components/Profile/addMyRequest";
import EditMyApplication from "./components/Profile/myEditApplication";
import Subscription from "./components/Subscription/subscription";
import About from "./components/About/about";
import Share from "./components/Share/share";
import AddReview from "./components/AddReview/addReview";
import ReviewDone from "./components/AddReview/reviewDone";
import Tarif from "./components/Tarif/tarif";
import EditMyRequest from "./components/Profile/editMyRequest"; // Импорт компонента для редактирования

function App() {
  const { user } = useUser();
  let tg = window.Telegram.WebApp;
  let userId = tg.initDataUnsafe.user ? tg.initDataUnsafe.user.id : "";
  if (userId === ""){
    return <div>403 Forbidden</div>
  }
  return (
    <>
      <Header />
      <Routes>
        {user?.role === "artist" ? (
          <Route exact path="/" element={<CatalogApplications />} />
        ) : user?.role === "customer" ? (
          <Route exact path="/" element={<CategorySearch />} />
        ) : (
          <Route exact path="/" element={<Main />} />
        )}
        <Route path="/category-artist" element={<CategorySearch />} />
        <Route path="/catalog-artist" element={<CatalogArtist />} />
        <Route path="/catalog-applications" element={<CatalogApplications />} />
        <Route
          path="/application-details/:id"
          element={<ApplicationDetails />}
        />
        <Route path="/artist/:id/:idCategory" element={<ArtistDetails />} />
        <Route path="/add-application" element={<AddApplication />} />
        <Route path="/application-done" element={<ApplicationDone />} />
        <Route path="/my-applications" element={<MyApplications />} />
        <Route path="/my-add-application" element={<AddMyApplication />} />
        <Route path="/my-edit-application/:id" element={<EditMyApplication />} />
        <Route path="/add-artist-request" element={<AddArtistRequest />} />
        <Route path="/artist-request-done" element={<DoneArtistRequest />} />
        <Route path="/my-add-request" element={<AddMyRequest />} />
        <Route path="/my-requests" element={<MyRequest />} />
        <Route path="/subscription" element={<Subscription />} />
        <Route path="/about" element={<About />} />
        <Route path="/share" element={<Share />} />
        <Route path="/addReview/:id" element={<AddReview />} />
        <Route path="/review-done" element={<ReviewDone />} />
        <Route path="/tarif/:id" element={<Tarif />} />
        <Route path="/edit-my-request" element={<EditMyRequest />} />

      </Routes>
      <Footer />
    </>
  );
}

export default App;
