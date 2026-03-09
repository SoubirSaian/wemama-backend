import { z } from "zod";


const createPostValidation = z.object({
    body: z.object({
      
        community: z.string().min(24,"Community id is requered."),
        content: z.string().min(1,"Content id is requered."),
        isAnonymous: z.boolean().optional()    
      
       
    }),
});

const giveLikeValidation = z.object({
    body: z.object({
      
        post: z.string().min(24,"Post id is requered."),
        name: z.string().min(1,"Commentator name is requered."),  
    }),
});

const makeCommentValidation = z.object({
    body: z.object({
        post: z.string().min(24,"Post id is requered."),
        comment: z.string().min(24,"Comment id is requered.").optional(),
        content: z.string().min(1,"Content is requered."),  
        name: z.string().min(1,"commentator name is requered."),  
    }),
});



const PostValidation = { 
  createPostValidation,
  giveLikeValidation,
  makeCommentValidation
 };

export default PostValidation;
