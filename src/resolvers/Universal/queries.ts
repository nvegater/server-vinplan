export const SQL_QUERY_UPDATE_UPVOTE = `
    update upvote
    set value = $1
    where "postId" = $2
      and "userId" = $3
`;

export const SQL_QUERY_UPDATE_POST_POINTS = `
    update post
    set points = points + $1
    where id = $2;
`;

export const SQL_QUERY_INSERT_NEW_UPVOTE = `
    insert into upvote ("userId", "postId", value)
    values ($1, $2, $3)
`;

export const SQL_QUERY_INSERT_RESERVATION = `
    insert into service_reservation ("serviceId", "userId")
    values ($1, $2)
`;

export const SQL_QUERY_SELECT_PAGINATED_POSTS = `
    select p.*,
           json_build_object(
                   'id', u.id,
                   'username', u.username,
                   'email', u.email,
                   'createdAt', u."createdAt",
                   'updatedAt', u."updatedAt"
               ) creator,
           null as "voteStatus"
    from post p
             inner join public.user u on u.id = p."creatorId"
    order by p."createdAt" DESC
    limit $1
`;


export const SQL_QUERY_SELECT_PAGINATED_POSTS_WITH_CURSOR = `
    select p.*,
           json_build_object(
                   'id', u.id,
                   'username', u.username,
                   'email', u.email,
                   'createdAt', u."createdAt",
                   'updatedAt', u."updatedAt"
               ) creator,
            null as "voteStatus"
    from post p
             inner join public.user u on u.id = p."creatorId"
    where p."createdAt" < $2
    order by p."createdAt" DESC
    limit $1
`;

export const SQL_QUERY_SELECT_PAGINATED_POSTS_USER_LOGGED_IN = `
    select p.*,
           json_build_object(
                   'id', u.id,
                   'username', u.username,
                   'email', u.email,
                   'createdAt', u."createdAt",
                   'updatedAt', u."updatedAt"
               ) creator,
   (select value from upvote where "userId" = $2 and "postId" = p.id) "voteStatus"
    from post p
             inner join public.user u on u.id = p."creatorId"
    order by p."createdAt" DESC
    limit $1
`;


export const SQL_QUERY_SELECT_PAGINATED_POSTS_WITH_CURSOR_USER_LOGGED_IN = `
    select p.*,
           json_build_object(
                   'id', u.id,
                   'username', u.username,
                   'email', u.email,
                   'createdAt', u."createdAt",
                   'updatedAt', u."updatedAt"
               ) creator,
    (select value from upvote where "userId" = $2 and "postId" = p.id) "voteStatus"
    from post p
             inner join public.user u on u.id = p."creatorId"
    where p."createdAt" < $3
    order by p."createdAt" DESC
    limit $1
`;

export const SQL_QUERY_SELECT_SERVICES_WITH_WINERY = `
    select ser.*,
           json_build_object(
                   'id', w.id,
                   'name', w.name
               ) winery
    from service ser
             inner join public.winery w on w.id = ser."wineryId"
    order by ser."startDate" DESC 
    limit $1
`;

export const SQL_QUERY_SELECT_WINERIES = `
    select w.*
    from winery w
    order by w."name" DESC
    limit $1;
`;


