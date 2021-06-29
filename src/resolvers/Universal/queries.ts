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
    insert into service_reservation ("noOfAttendees",
                                     "serviceId",
                                     "userId",
                                     "paypalOrderId",
                                     "pricePerPersonInDollars",
                                     "paymentCreationDateTime",
                                     "status",
                                     "serviceCreatorId")
    values ($1, $2, $3, $4, $5, $6, $7, $8)
`;

export const SQL_QUERY_UPDATE_SERVICE = `
    update service
    set "noOfAttendees" = "noOfAttendees" + $1
    where "id" = $2
      and "creatorId" = $3;
`;

export const SQL_QUERY_UPDATE_RESERVATION = `
    update service_reservation
    set "noOfAttendees" = "noOfAttendees" + $1
    where "serviceId" = $2
      and "userId" = $3
      and "paypalOrderId" = $4
`;

export const SQL_QUERY_SELECT_PAGINATED_POSTS = `
    select p.*,
           json_build_object(
                   'id', u.id,
                   'username', u.username,
                   'email', u.email,
                   'createdAt', u."createdAt",
                   'updatedAt', u."updatedAt"
               )   creator,
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
               )   creator,
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

export const SQL_QUERY_SELECT_PAGINATED_EXPERIENCES = `
    select ser.*,
           json_build_object(
                   'id', w.id,
                   'name', w.name
               ) winery
    from service ser
             inner join public.winery w on w.id = ser."wineryId"
    order by ser."startDateTime" DESC
    limit $1
`;

export const SQL_QUERY_SELECT_PAGINATED_EXPERIENCES_WITH_CURSOR = `
    select ser.*
    from service ser
    where ser."startDateTime" < $2
    order by ser."createdAt" DESC
    limit $1
`;

export const SQL_QUERY_SELECT_RESERVATIONS_WITH_USER_AND_SERVICE = `
    select sr.*,
           json_build_object(
                   'id', u.id,
                   'username', u."username",
                   'userType', u."userType"
               ) "userFromReservation",
           json_build_object(
                   'id', s.id,
                   'noOfAttendees', s."noOfAttendees",
                   'startDateTime', s."startDateTime",
                   'pricePerPersonInDollars', s."pricePerPersonInDollars"
               ) "serviceFromReservation"
    from service_reservation sr
             inner join public.user u on u.id = sr."userId"
             inner join public.service s on s.id = sr."serviceId"
    order by sr."serviceId" DESC
    limit $1
`;

export const SQL_QUERY_SELECT_WINERIES = `
    select w.*
    from winery w
    order by w."name" DESC
    limit $1;
`;

export const SQL_QUERY_GET_RESERVED_SERVICES_IDS = `
    select array(select sr."serviceId"
                 from service_reservation sr
                 where "userId" = $1) as "reservedServicesIds";
`;


