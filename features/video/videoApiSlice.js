import { apiSlice } from "@/app/api/apiSlice";
import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";

const videoAdapter = createEntityAdapter({})
 
const initialState = videoAdapter.getInitialState()

export const videoApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getVideo: builder.query({
            query: ({category = ''}) => ({
              url: '/v1/video/get-video',
               params: {
                 category
               }
            }),
            validateStatus: (response, result) => {
              return response.status === 200 && !result.isError;
            },
            transformResponse: (responseData) => {
                // console.log({responseData})
              const loadedVideo = responseData.videos.map(video => ({
                ...video,
                id: video._id
              }));
              return videoAdapter.setAll(initialState, loadedVideo);
            },
            providesTags: (result, error, arg) => {
              if(result?.ids) {
                return [
                  { type: 'Video', id: 'List' },
                  ...result.ids.map(id => ({ type: 'Video', id }))
                ];
              } else {
                return [{ type: 'Video', id: 'List' }];
              }
            }
          }),
           getVideoById: builder.query({
            query: (id) => `/v1/video/get-video/${id}`,
             validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
             },
            //  keepUnusedDataFor:5,
            transformResponse: responseData => {
                // Single feed response doesn't need .feed property
                return videoAdapter.setOne(initialState, {
                  ...responseData.videoId,
                  id: responseData.videoId._id
                });
              },
             providesTags: (result, error, arg) => {
                if(result?.ids){
             return [{type:'Video', id:'List'},
             ...result.ids.map(id => ({type: 'Video', id}))
            ]
                }else {
                    return [{type: 'Video', id: 'List'}]
                }
             }
        }),
          addNewVideo: builder.mutation({
            query: initailVideoData => ({
                url: '/v1/video/upload-video',
                method: 'POST',
                body: {
                    ...initailVideoData
                }
            }),
            invalidatesTags: [
                {type: 'Video', id: 'List'}
            ]
          }),
         likeVideo: builder.mutation({
  query: ({ userId, id }) => ({
    url: `/v1/video/like-video/${id}`,
    method: 'PATCH',
    body: { userId }
  }),
  // Ultra-fast optimistic update
  onQueryStarted({ id, userId }, { dispatch, queryFulfilled, getState }) {
    const currentUser = userId; // Ideally from your auth state
    
    // 1. IMMEDIATE UI UPDATE (before request even goes out)
    const patchResult = dispatch(
      apiSlice.util.updateQueryData('getVideo', id, (draft) => {
        console.log('Draft:', JSON.parse(JSON.stringify(draft)))
        if (!draft) return;
        
        const alreadyLiked = draft.likes.includes(currentUser);
        draft.likes = alreadyLiked
          ? draft.likes.filter(id => id !== currentUser)
          : [...draft.likes, currentUser];
      })
    );

    // 2. Silent error recovery
    queryFulfilled.catch(() => {
      patchResult.undo();
      // Optional: Show subtle "sync failed" indicator
    });
  },
  invalidatesTags: (result, error, { id }) => [
  { type: 'Video', id },
  { type: 'Video', id: 'LIST' }
]
}),

          unlikeVideo: builder.mutation({
            query: ({userId, id}) => ({
                url: `/v1/video/unlike-video/${id}`,
                method:'PATCH',
                body: {userId}
            }),

             async onQueryStarted({id}, {queryFulfilled, dispatch, getState})  {

                const token = getState().auth.token

               const decodedToken = JSON.parse(atob(token.split('.')[1]))
               const currentUser = decodedToken?.UserInfo?.id || decodedToken?.id

               try {

                  await queryFulfilled
                    
                   var patchResult = dispatch(
                     apiSlice.util.updateQueryData('getVideo', undefined, ({draft}) => {

                       console.log({draft})

                       const liked = draft?.entities[id]
                        if(!liked) return 
                        
                        if(liked?.likes?.includes(currentUser)){
                           liked.likes.pull(currentUser)
                        }

                     })
                   )

               } catch(error){
                console.error('Cache update failed', error)
                patchResult.undo()
               }

               
              

              },
            invalidatesTags: (result, error, { id }) => [
              { type: 'Video', id },
              { type: 'Video', id: 'LIST' }
            ]
          }),
          deleteVideo: builder.mutation({
            query: ({id}) => ({
                url: '/video',
                method: 'DELETE',
                body: {
                    id
                }
            }),
            invalidatesTags: (result, error, arg) => [{type: 'Video', id:arg.id}]
          }),
        }),
        overrideExisting: true

})

export const {  
  useGetVideoQuery,
 useAddNewVideoMutation,
 useDeleteVideoMutation,
 useLikeVideoMutation,
 useUnlikeVideoMutation,
 useGetVideoByIdQuery
} = videoApiSlice

// returns the query result object
export const selectVideoResult = videoApiSlice.endpoints.getVideo.select()

// creates memoized selector
const selectVideoData = createSelector(
selectVideoResult,
videoResult => videoResult.data // normalized state object with ids & entities
)

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
selectAll: selectAllVideos,
selectById: selectVideoById,
selectIds: selectVideoIds
// Pass in a selector that returns the Videos slice of state
} = videoAdapter.getSelectors(state => selectVideoData(state) ?? initialState)

