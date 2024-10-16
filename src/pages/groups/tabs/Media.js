import MediaMenu from "../../../components/media/MediaMenu";
export default function Media({ sk, type ,  idGroup, loading, photos , setVisiblePhoto}) {
  return (
    <div className="pagegroupe_about_card">
      <MediaMenu sk={sk} type={type} idGroup={idGroup} loading={loading} photos={photos} setVisiblePhoto={setVisiblePhoto} />
    </div>
  );
}
