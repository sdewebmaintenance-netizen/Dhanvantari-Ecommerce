const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const { PrismaClient } = require("@prisma/client");
const { CLIENT_ID, CLIENT_SECRET, CALL_BACK_URL } = require("./configuration");
const prisma = new PrismaClient();

passport.use(
  new GoogleStrategy(
    {
      clientID: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      callbackURL: CALL_BACK_URL,
      passReqToCallback: true,
    },
    async function (request, accessToken, refreshToken, profile, done) {
      try {
        const email = profile.email;

        const user = await prisma.User.upsert({
          where: { email: email },
          update: {
            username: profile.displayName,
            display_picture: profile.photos[0]?.value || null,
            updatedAt: new Date(),
          },
          create: {
            email: email,
            username: profile.displayName,
            display_picture: profile.photos[0]?.value || null,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });
        console.log(user,"user")

        return done(null, {
          user_id: user.id,
          username: user.username,
          email: user.email,
          isAdmin:user.isAdmin
        });
      } catch (error) {
        console.error("Error in GoogleStrategy:", error);
        return done(error, null);
      }
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

module.exports = passport;
