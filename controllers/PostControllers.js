import PostModel from "../models/Posts.js";

export let getLastTags = async (req, res) => {
    try {
        const posts = await PostModel.find().limit(5).exec()
        const tags = posts.map(post => post.tags)
            .flat()
            .slice(0, 5)

        res.json(tags)

    } catch (err) {
        res.stale(500).json({
            message: " posts not loaded"
        })
    }
};


export const create = async (req, res) => {
    try {

        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            tags: req.body.tags.split(','),
            imageUrl: req.body.imageUrl,
            user: req.userId
        })
        const post = await doc.save()
        res.json(post)
    } catch (err) {
        res.status(500).json({
            message: " Post not created"
        })
    }

}
export const getAll = async (req, res) => {
    try {
        const posts = await PostModel.find().populate('user').exec()
        res.json(posts)

    } catch (err) {
        res.stale(500).json({
            message: " posts not loaded"
        })
    }
}

export const getOne = async (req, res) => {

    try {
        const postId = req.params.id
        const post = await PostModel.findOneAndUpdate(
            {
                _id: postId
            },
            {
                $inc: {viewCount: 1}
            },
            {
                new: true
            },
        ).populate('user')
        res.json(post)
    } catch (err) {
        res.status(500).json({
            message: "post not load..."
        })
    }
}
export const remove = async (req, res) => {

    try {
        const postId = req.params.id
        const doc = await PostModel.findOneAndDelete({
            _id: postId
        })
        if (!doc) {
            return res.status(404).json({
                message: "Post not found"
            })
        }
        res.json({
            success: true
        })
    } catch (err) {
        res.status(500).json({
            message: "post not delete"
        })
    }
}
export const update = async (req, res) => {

    try {
        const postId = req.params.id
        const doc = await PostModel.updateOne(
            {
                _id: postId
            },
            {
                title: req.body.title,
                text: req.body.text,
                tags: req.body.tags.split(','),
                imageUrl: req.body.imageUrl,
                user: req.userId

            })
        if (doc.matchedCount === 1) {
            res.status(200).json({
                message: "Post updated"
            })
        } else res.status(400).json({
            message: "Post not updated"
        })

    } catch (err) {
        res.status(500).json({
            message: "post not update"
        })
    }
}
export const upload = async (req, res) => {
    res.json({
        url: `/uploads/${req.file.filename}`
    })


}
