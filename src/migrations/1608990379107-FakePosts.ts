import {MigrationInterface, QueryRunner} from "typeorm";

export class FakePosts1608990379107 implements MigrationInterface {

    public async up(_: QueryRunner): Promise<void> {
/*
        queryRunner.query(
            `
            insert into post (title, text, "creatorId", "createdAt") values ('JCVD', 'Curabitur gravida nisi at nibh. In hac habitasse platea dictumst. Aliquam augue quam, sollicitudin vitae, consectetuer eget, rutrum at, lorem.

Integer tincidunt ante vel ipsum. Praesent blandit lacinia erat. Vestibulum sed magna at nunc commodo placerat.', 1, '2020-07-20T21:11:40Z');
insert into post (title, text, "creatorId", "createdAt") values ('Faces in the Crowd', 'Sed ante. Vivamus tortor. Duis mattis egestas metus.

Aenean fermentum. Donec ut mauris eget massa tempor convallis. Nulla neque libero, convallis eget, eleifend luctus, ultricies eu, nibh.

Quisque id justo sit amet sapien dignissim vestibulum. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nulla dapibus dolor vel est. Donec odio justo, sollicitudin ut, suscipit a, feugiat et, eros.', 1, '2020-10-17T09:37:53Z');
insert into post (title, text, "creatorId", "createdAt") values ('Project Grizzly', 'Proin interdum mauris non ligula pellentesque ultrices. Phasellus id sapien in sapien iaculis congue. Vivamus metus arcu, adipiscing molestie, hendrerit at, vulputate vitae, nisl.

Aenean lectus. Pellentesque eget nunc. Donec quis orci eget orci vehicula condimentum.

Curabitur in libero ut massa volutpat convallis. Morbi odio odio, elementum eu, interdum eu, tincidunt in, leo. Maecenas pulvinar lobortis est.', 1, '2020-07-06T23:18:59Z');
insert into post (title, text, "creatorId", "createdAt") values ('Children On Their Birthdays', 'Nullam porttitor lacus at turpis. Donec posuere metus vitae ipsum. Aliquam non mauris.', 1, '2020-12-06T12:19:20Z');
insert into post (title, text, "creatorId", "createdAt") values ('Wonder Woman', 'Maecenas tristique, est et tempus semper, est quam pharetra magna, ac consequat metus sapien ut nunc. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris viverra diam vitae quam. Suspendisse potenti.

Nullam porttitor lacus at turpis. Donec posuere metus vitae ipsum. Aliquam non mauris.

Morbi non lectus. Aliquam sit amet diam in magna bibendum imperdiet. Nullam orci pede, venenatis non, sodales sed, tincidunt eu, felis.', 1, '2020-04-18T23:28:45Z');
insert into post (title, text, "creatorId", "createdAt") values ('Rasputin', 'In hac habitasse platea dictumst. Etiam faucibus cursus urna. Ut tellus.

Nulla ut erat id mauris vulputate elementum. Nullam varius. Nulla facilisi.

Cras non velit nec nisi vulputate nonummy. Maecenas tincidunt lacus at velit. Vivamus vel nulla eget eros elementum pellentesque.', 1, '2020-01-17T08:48:56Z');
insert into post (title, text, "creatorId", "createdAt") values ('My Name Is Joe', 'Maecenas tristique, est et tempus semper, est quam pharetra magna, ac consequat metus sapien ut nunc. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris viverra diam vitae quam. Suspendisse potenti.

Nullam porttitor lacus at turpis. Donec posuere metus vitae ipsum. Aliquam non mauris.

Morbi non lectus. Aliquam sit amet diam in magna bibendum imperdiet. Nullam orci pede, venenatis non, sodales sed, tincidunt eu, felis.', 1, '2020-06-18T22:46:16Z');
insert into post (title, text, "creatorId", "createdAt") values ('Bride of the Monster', 'Vestibulum ac est lacinia nisi venenatis tristique. Fusce congue, diam id ornare imperdiet, sapien urna pretium nisl, ut volutpat sapien arcu sed augue. Aliquam erat volutpat.

In congue. Etiam justo. Etiam pretium iaculis justo.

In hac habitasse platea dictumst. Etiam faucibus cursus urna. Ut tellus.', 1, '2020-10-18T03:00:00Z');
insert into post (title, text, "creatorId", "createdAt") values ('Percy Jackson: Sea of Monsters', 'Aenean lectus. Pellentesque eget nunc. Donec quis orci eget orci vehicula condimentum.

Curabitur in libero ut massa volutpat convallis. Morbi odio odio, elementum eu, interdum eu, tincidunt in, leo. Maecenas pulvinar lobortis est.', 1, '2020-01-27T19:36:29Z');
insert into post (title, text, "creatorId", "createdAt") values ('Little Nicky', 'Suspendisse potenti. In eleifend quam a odio. In hac habitasse platea dictumst.

Maecenas ut massa quis augue luctus tincidunt. Nulla mollis molestie lorem. Quisque ut erat.', 1, '2020-11-16T00:27:08Z');
insert into post (title, text, "creatorId", "createdAt") values ('American Mary', 'Proin eu mi. Nulla ac enim. In tempor, turpis nec euismod scelerisque, quam turpis adipiscing lorem, vitae mattis nibh ligula nec sem.

Duis aliquam convallis nunc. Proin at turpis a pede posuere nonummy. Integer non velit.

Donec diam neque, vestibulum eget, vulputate ut, ultrices vel, augue. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec pharetra, magna vestibulum aliquet ultrices, erat tortor sollicitudin mi, sit amet lobortis sapien sapien non mi. Integer ac neque.', 2, '2020-06-17T19:35:48Z');
insert into post (title, text, "creatorId", "createdAt") values ('Spanish Prisoner, The', 'Vestibulum ac est lacinia nisi venenatis tristique. Fusce congue, diam id ornare imperdiet, sapien urna pretium nisl, ut volutpat sapien arcu sed augue. Aliquam erat volutpat.

In congue. Etiam justo. Etiam pretium iaculis justo.', 2, '2020-09-13T22:15:08Z');
insert into post (title, text, "creatorId", "createdAt") values ('29th Street', 'Sed sagittis. Nam congue, risus semper porta volutpat, quam pede lobortis ligula, sit amet eleifend pede libero quis orci. Nullam molestie nibh in lectus.', 2, '2020-06-30T09:36:38Z');
insert into post (title, text, "creatorId", "createdAt") values ('Mind Game', 'Morbi porttitor lorem id ligula. Suspendisse ornare consequat lectus. In est risus, auctor sed, tristique in, tempus sit amet, sem.

Fusce consequat. Nulla nisl. Nunc nisl.', 2, '2020-04-27T17:35:18Z');
insert into post (title, text, "creatorId", "createdAt") values ('Blackbird', 'Sed sagittis. Nam congue, risus semper porta volutpat, quam pede lobortis ligula, sit amet eleifend pede libero quis orci. Nullam molestie nibh in lectus.', 2, '2020-07-25T04:02:39Z');
insert into post (title, text, "creatorId", "createdAt") values ('Victor/Victoria', 'Maecenas ut massa quis augue luctus tincidunt. Nulla mollis molestie lorem. Quisque ut erat.', 2, '2020-11-17T10:31:12Z');
insert into post (title, text, "creatorId", "createdAt") values ('Sazen Tange and the Pot Worth a Million Ryo', 'Integer tincidunt ante vel ipsum. Praesent blandit lacinia erat. Vestibulum sed magna at nunc commodo placerat.

Praesent blandit. Nam nulla. Integer pede justo, lacinia eget, tincidunt eget, tempus vel, pede.', 2, '2020-05-29T01:52:02Z');
insert into post (title, text, "creatorId", "createdAt") values ('The Butterfly Effect 2', 'Quisque porta volutpat erat. Quisque erat eros, viverra eget, congue eget, semper rutrum, nulla. Nunc purus.

Phasellus in felis. Donec semper sapien a libero. Nam dui.

Proin leo odio, porttitor id, consequat in, consequat ut, nulla. Sed accumsan felis. Ut at dolor quis odio consequat varius.', 2, '2020-09-04T14:54:44Z');
insert into post (title, text, "creatorId", "createdAt") values ('Blood Beast Terror, The', 'Curabitur gravida nisi at nibh. In hac habitasse platea dictumst. Aliquam augue quam, sollicitudin vitae, consectetuer eget, rutrum at, lorem.', 2, '2020-07-20T06:21:05Z');
insert into post (title, text, "creatorId", "createdAt") values ('Monster-in-Law', 'Mauris enim leo, rhoncus sed, vestibulum sit amet, cursus id, turpis. Integer aliquet, massa id lobortis convallis, tortor risus dapibus augue, vel accumsan tellus nisi eu orci. Mauris lacinia sapien quis libero.

Nullam sit amet turpis elementum ligula vehicula consequat. Morbi a ipsum. Integer a nibh.

In quis justo. Maecenas rhoncus aliquam lacus. Morbi quis tortor id nulla ultrices aliquet.', 2, '2020-11-06T21:05:02Z');
insert into post (title, text, "creatorId", "createdAt") values ('Angels in America', 'Praesent blandit. Nam nulla. Integer pede justo, lacinia eget, tincidunt eget, tempus vel, pede.', 3, '2020-08-11T07:14:48Z');
insert into post (title, text, "creatorId", "createdAt") values ('Valley of the Bees (Údolí vcel)', 'Aliquam quis turpis eget elit sodales scelerisque. Mauris sit amet eros. Suspendisse accumsan tortor quis turpis.

Sed ante. Vivamus tortor. Duis mattis egestas metus.', 3, '2020-06-20T11:19:37Z');
insert into post (title, text, "creatorId", "createdAt") values ('Haunted House', 'Maecenas tristique, est et tempus semper, est quam pharetra magna, ac consequat metus sapien ut nunc. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris viverra diam vitae quam. Suspendisse potenti.

Nullam porttitor lacus at turpis. Donec posuere metus vitae ipsum. Aliquam non mauris.', 3, '2020-05-11T18:21:51Z');
insert into post (title, text, "creatorId", "createdAt") values ('Sky West and Crooked (Gypsy Girl)', 'Proin interdum mauris non ligula pellentesque ultrices. Phasellus id sapien in sapien iaculis congue. Vivamus metus arcu, adipiscing molestie, hendrerit at, vulputate vitae, nisl.', 3, '2020-06-03T14:17:44Z');
insert into post (title, text, "creatorId", "createdAt") values ('Rough Riders', 'Nullam sit amet turpis elementum ligula vehicula consequat. Morbi a ipsum. Integer a nibh.

In quis justo. Maecenas rhoncus aliquam lacus. Morbi quis tortor id nulla ultrices aliquet.

Maecenas leo odio, condimentum id, luctus nec, molestie sed, justo. Pellentesque viverra pede ac diam. Cras pellentesque volutpat dui.', 3, '2020-09-19T13:32:27Z');
insert into post (title, text, "creatorId", "createdAt") values ('Possible Loves (Amores Possíveis)', 'Praesent blandit. Nam nulla. Integer pede justo, lacinia eget, tincidunt eget, tempus vel, pede.

Morbi porttitor lorem id ligula. Suspendisse ornare consequat lectus. In est risus, auctor sed, tristique in, tempus sit amet, sem.', 3, '2020-05-21T09:01:43Z');
insert into post (title, text, "creatorId", "createdAt") values ('Yellow', 'Vestibulum ac est lacinia nisi venenatis tristique. Fusce congue, diam id ornare imperdiet, sapien urna pretium nisl, ut volutpat sapien arcu sed augue. Aliquam erat volutpat.', 3, '2020-10-02T11:05:09Z');
insert into post (title, text, "creatorId", "createdAt") values ('The Linguists', 'Cras mi pede, malesuada in, imperdiet et, commodo vulputate, justo. In blandit ultrices enim. Lorem ipsum dolor sit amet, consectetuer adipiscing elit.', 3, '2020-06-27T19:57:06Z');
insert into post (title, text, "creatorId", "createdAt") values ('Legalese', 'Duis bibendum. Morbi non quam nec dui luctus rutrum. Nulla tellus.

In sagittis dui vel nisl. Duis ac nibh. Fusce lacus purus, aliquet at, feugiat non, pretium quis, lectus.', 3, '2020-02-24T19:26:39Z');
insert into post (title, text, "creatorId", "createdAt") values ('Short Circuit 2', 'In hac habitasse platea dictumst. Morbi vestibulum, velit id pretium iaculis, diam erat fermentum justo, nec condimentum neque sapien placerat ante. Nulla justo.

Aliquam quis turpis eget elit sodales scelerisque. Mauris sit amet eros. Suspendisse accumsan tortor quis turpis.', 3, '2020-01-15T13:33:16Z');
insert into post (title, text, "creatorId", "createdAt") values ('25th Hour', 'Maecenas ut massa quis augue luctus tincidunt. Nulla mollis molestie lorem. Quisque ut erat.', 1, '2020-07-20T07:12:52Z');
insert into post (title, text, "creatorId", "createdAt") values ('Finding Forrester', 'Cras mi pede, malesuada in, imperdiet et, commodo vulputate, justo. In blandit ultrices enim. Lorem ipsum dolor sit amet, consectetuer adipiscing elit.

Proin interdum mauris non ligula pellentesque ultrices. Phasellus id sapien in sapien iaculis congue. Vivamus metus arcu, adipiscing molestie, hendrerit at, vulputate vitae, nisl.', 1, '2020-01-01T01:27:32Z');
insert into post (title, text, "creatorId", "createdAt") values ('Crawling Hand, The', 'In sagittis dui vel nisl. Duis ac nibh. Fusce lacus purus, aliquet at, feugiat non, pretium quis, lectus.', 1, '2020-11-22T00:17:31Z');
insert into post (title, text, "creatorId", "createdAt") values ('Happiness of the Katakuris, The (Katakuri-ke no kôfuku)', 'Quisque porta volutpat erat. Quisque erat eros, viverra eget, congue eget, semper rutrum, nulla. Nunc purus.

Phasellus in felis. Donec semper sapien a libero. Nam dui.', 1, '2020-06-01T21:13:25Z');
insert into post (title, text, "creatorId", "createdAt") values ('Born on the Fourth of July', 'Morbi non lectus. Aliquam sit amet diam in magna bibendum imperdiet. Nullam orci pede, venenatis non, sodales sed, tincidunt eu, felis.

Fusce posuere felis sed lacus. Morbi sem mauris, laoreet ut, rhoncus aliquet, pulvinar sed, nisl. Nunc rhoncus dui vel sem.

Sed sagittis. Nam congue, risus semper porta volutpat, quam pede lobortis ligula, sit amet eleifend pede libero quis orci. Nullam molestie nibh in lectus.', 1, '2020-10-23T20:54:16Z');
insert into post (title, text, "creatorId", "createdAt") values ('Morsian yllättää', 'Proin interdum mauris non ligula pellentesque ultrices. Phasellus id sapien in sapien iaculis congue. Vivamus metus arcu, adipiscing molestie, hendrerit at, vulputate vitae, nisl.

Aenean lectus. Pellentesque eget nunc. Donec quis orci eget orci vehicula condimentum.', 1, '2020-10-24T11:09:54Z');
insert into post (title, text, "creatorId", "createdAt") values ('Direct Contact', 'Sed sagittis. Nam congue, risus semper porta volutpat, quam pede lobortis ligula, sit amet eleifend pede libero quis orci. Nullam molestie nibh in lectus.

Pellentesque at nulla. Suspendisse potenti. Cras in purus eu magna vulputate luctus.

Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vivamus vestibulum sagittis sapien. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.', 1, '2020-05-23T14:29:08Z');
insert into post (title, text, "creatorId", "createdAt") values ('Hellboy', 'Aliquam quis turpis eget elit sodales scelerisque. Mauris sit amet eros. Suspendisse accumsan tortor quis turpis.

Sed ante. Vivamus tortor. Duis mattis egestas metus.

Aenean fermentum. Donec ut mauris eget massa tempor convallis. Nulla neque libero, convallis eget, eleifend luctus, ultricies eu, nibh.', 1, '2020-04-07T00:41:01Z');
insert into post (title, text, "creatorId", "createdAt") values ('The Care Bears Adventure in Wonderland', 'Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vivamus vestibulum sagittis sapien. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.', 1, '2020-11-22T03:45:03Z');
insert into post (title, text, "creatorId", "createdAt") values ('Beloved (Les bien-aimées)', 'Vestibulum ac est lacinia nisi venenatis tristique. Fusce congue, diam id ornare imperdiet, sapien urna pretium nisl, ut volutpat sapien arcu sed augue. Aliquam erat volutpat.', 1, '2020-04-22T20:10:52Z');
insert into post (title, text, "creatorId", "createdAt") values ('Oliver Twist', 'Integer ac leo. Pellentesque ultrices mattis odio. Donec vitae nisi.

Nam ultrices, libero non mattis pulvinar, nulla pede ullamcorper augue, a suscipit nulla elit ac nulla. Sed vel enim sit amet nunc viverra dapibus. Nulla suscipit ligula in lacus.

Curabitur at ipsum ac tellus semper interdum. Mauris ullamcorper purus sit amet nulla. Quisque arcu libero, rutrum ac, lobortis vel, dapibus at, diam.', 1, '2020-02-27T15:04:19Z');
insert into post (title, text, "creatorId", "createdAt") values ('Finding Forrester', 'Fusce consequat. Nulla nisl. Nunc nisl.', 1, '2020-01-13T06:08:43Z');
insert into post (title, text, "creatorId", "createdAt") values ('Dr. Dolittle', 'Aliquam quis turpis eget elit sodales scelerisque. Mauris sit amet eros. Suspendisse accumsan tortor quis turpis.

Sed ante. Vivamus tortor. Duis mattis egestas metus.', 1, '2020-10-16T22:35:48Z');
insert into post (title, text, "creatorId", "createdAt") values ('Dinosaurs: A Fun Filled Trip Back in Time', 'Duis bibendum, felis sed interdum venenatis, turpis enim blandit mi, in porttitor pede justo eu massa. Donec dapibus. Duis at velit eu est congue elementum.

In hac habitasse platea dictumst. Morbi vestibulum, velit id pretium iaculis, diam erat fermentum justo, nec condimentum neque sapien placerat ante. Nulla justo.

Aliquam quis turpis eget elit sodales scelerisque. Mauris sit amet eros. Suspendisse accumsan tortor quis turpis.', 1, '2020-08-13T12:28:15Z');
insert into post (title, text, "creatorId", "createdAt") values ('Proposal, The', 'Nam ultrices, libero non mattis pulvinar, nulla pede ullamcorper augue, a suscipit nulla elit ac nulla. Sed vel enim sit amet nunc viverra dapibus. Nulla suscipit ligula in lacus.

Curabitur at ipsum ac tellus semper interdum. Mauris ullamcorper purus sit amet nulla. Quisque arcu libero, rutrum ac, lobortis vel, dapibus at, diam.', 1, '2020-11-26T02:03:33Z');
insert into post (title, text, "creatorId", "createdAt") values ('Hamlet', 'Curabitur gravida nisi at nibh. In hac habitasse platea dictumst. Aliquam augue quam, sollicitudin vitae, consectetuer eget, rutrum at, lorem.', 1, '2020-11-08T15:40:00Z');
insert into post (title, text, "creatorId", "createdAt") values ('Mammuth', 'Mauris enim leo, rhoncus sed, vestibulum sit amet, cursus id, turpis. Integer aliquet, massa id lobortis convallis, tortor risus dapibus augue, vel accumsan tellus nisi eu orci. Mauris lacinia sapien quis libero.', 1, '2020-04-08T20:02:06Z');
insert into post (title, text, "creatorId", "createdAt") values ('Breaking Point', 'Mauris enim leo, rhoncus sed, vestibulum sit amet, cursus id, turpis. Integer aliquet, massa id lobortis convallis, tortor risus dapibus augue, vel accumsan tellus nisi eu orci. Mauris lacinia sapien quis libero.', 1, '2020-11-05T18:26:18Z');
insert into post (title, text, "creatorId", "createdAt") values ('Breaktime, The (Zang-e Tafrih) (Recess)', 'Morbi non lectus. Aliquam sit amet diam in magna bibendum imperdiet. Nullam orci pede, venenatis non, sodales sed, tincidunt eu, felis.

Fusce posuere felis sed lacus. Morbi sem mauris, laoreet ut, rhoncus aliquet, pulvinar sed, nisl. Nunc rhoncus dui vel sem.

Sed sagittis. Nam congue, risus semper porta volutpat, quam pede lobortis ligula, sit amet eleifend pede libero quis orci. Nullam molestie nibh in lectus.', 1, '2020-10-02T08:45:46Z');
insert into post (title, text, "creatorId", "createdAt") values ('Kaspar Hauser', 'Phasellus sit amet erat. Nulla tempus. Vivamus in felis eu sapien cursus vestibulum.', 1, '2020-02-14T18:59:00Z');

            `
        )
*/
    }

    public async down(_queryRunner: QueryRunner): Promise<void> {
    }

}
