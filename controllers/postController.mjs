import prisma from "../lib/prisma.mjs";

export const getPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany();
    return res.status(200).json({ success: true, data: posts });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
export const getPost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await prisma.post.findUnique({
      where: {
        id,
      },
      include: {
        PostDetails: true,
        user: {
          select: {
            username: true,
            avatar: true,
          },
        },
      },
    });
    return res.status(200).json({ success: true, data: post });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const createPost = async (req, res) => {
  try {
    const {
      body: { postData, postDetails },
      user: { id: userId } = {},
    } = req;
    const post = await prisma.post.create({
      data: {
        ...postData,
        userId,
        PostDetails: {
          create: postDetails,
        },
      },
    });
    return res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: post,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.post.update({
      where: {
        id,
      },
      data: { ...req.body },
    });
    return res
      .status(200)
      .json({ success: true, message: "Post updated successfully" });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const post = await prisma.post.findUnique({
      where: {
        id: Number(req.params.id),
      },
    });

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }
    if (post.userId !== userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    await prisma.post.delete({
      where: {
        id: Number(req.params.id),
      },
    });
    return res
      .status(200)
      .json({ success: true, message: "Post deleted successfully" });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
