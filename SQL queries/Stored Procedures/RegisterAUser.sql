USE [Booksterdam]
GO
/****** Object:  StoredProcedure [dbo].[RegisterAUser]    Script Date: 2/13/2017 7:55:54 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Vivek Pandey
-- Create date: 02/13/2016
-- Description:	Registers a user into the database. 
--				Checks if the provided user email is a unique one in LoginCredentials. If yes, adds info to LoginCredentials and CustomerRecords and returns 1 on success. If already exists, returns 2. If process fails, returns 3 
-- =============================================
ALTER PROCEDURE [dbo].[RegisterAUser] 
	-- Add the parameters for the stored procedure here
	@email VARCHAR(50) = NULL,
	@password VARCHAR(60) = NULL,
	@lastName VARCHAR(40) = NULL,
	@middleName VARCHAR(40) = NULL,
	@firstName VARCHAR(40) = NULL,
	@street VARCHAR(40) = NULL,
	@city VARCHAR(20) = NULL,
	@zipCode INT = NULL,
	@stateName VARCHAR(2) = NULL,
	@country VARCHAR(40) = NULL,
	@phone INT = NULL
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here 
	-- Return 1 if insertion successfully
	-- Return 2 if email already exists in records
	-- Return 3 if technical failure during insertion
	IF EXISTS (SELECT 1 FROM LoginCredentials WHERE email = @email)
		RETURN 2
	ELSE
		INSERT INTO LoginCredentials (email, hashedPassword) VALUES (@email, @password);
		IF (@@ROWCOUNT = 0)
			RETURN 3

		INSERT INTO CustomerRecords (isSeller, isBuyer, lastName, middleName, firstName, street, city, zipCode, stateName, country, phone, email) 
		VALUES (1, 1, @lastName, @middleName, @firstName, @street, @city, @zipCode, @stateName, @country, @phone, @email);
		
		-- If zero rows affected, the insertion wasn't successful
		IF (@@ROWCOUNT = 0)
			RETURN 3

		RETURN 1;
END
