import PhotoMenu from "../../../components/photo/PhotoMenu";
export default function Photos({ sk, idUser, loading, photos, user ,setVisiblePhoto}) {

  return (
    
    <div className="about_card"  style={{ display: "flow" }}>
      <PhotoMenu
        sk={sk}
        idUser={idUser}
        loading={loading}
        user={user}
        photos={photos}
        setVisiblePhoto={setVisiblePhoto}
      />
    </div>
  );
}
