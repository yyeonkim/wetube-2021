export const trending = (req, res) => res.send("Trending Video");
export const see = (req, res) => {
  console.log(req.params);
  return res.send(`Watch Video ID #${req.params.id}`);
};
export const edit = (req, res) => {
  console.log(req.params);
  return res.send("Edit Video");
};
export const search = (req, res) => res.send("Search Video");
export const upload = (req, res) => res.send("Upload Video");
export const deleteVideo = (req, res) => {
  console.log("req.param");
  return res.send("Delte Video");
};
