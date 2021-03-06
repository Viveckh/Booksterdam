USE [Booksterdam]
GO
/****** Object:  StoredProcedure [dbo].[FetchHashedPassword]    Script Date: 2/27/2017 9:04:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Vivek Pandey
-- Create date: 27th February 2017
-- Description:	Returns the hashed password from the LoginCredentials table when provided with email. Returns 'null' if email isn't registered
-- =============================================
ALTER PROCEDURE [dbo].[FetchHashedPassword]
	-- Add the parameters for the stored procedure here
	@email VARCHAR(50) = NULL,
	@password VARCHAR(60) OUTPUT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	IF EXISTS (SELECT 1 FROM LoginCredentials WHERE email = @email)
		SELECT @password = hashedPassword FROM LoginCredentials WHERE email = @email
	ELSE
		SET @password = NULL;
END
