'use client'
import { useState } from 'react';
import { CardTitle, CardDescription, CardHeader, CardContent, Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation';


const login = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: '' });

      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
          ...prevData,
          [name]: value
        }));
      };


  const handleSubmit = async (event) => {
    event.preventDefault();
    // Handle form submission logic here
    console.log()
    const response =  await fetch('http://localhost:8000/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email:formData.email,
          password:formData.password    }),
      })

      if(response.status != 200){
        let message = await response.json()
        alert(message.message)
        console.log("Error")
    }
    else{
        router.push('/dashboard')
    } 
  }

  return (
    <Card className="mx-auto max-w-sm mt-16">
    <CardHeader className="space-y-1">
      <CardTitle className="text-2xl font-bold">Signup</CardTitle>
      <CardDescription>Please fill in the following details to create an account</CardDescription>
    </CardHeader>
    <CardContent>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" placeholder="example@example.com" value={formData.email} onChange={handleChange} type="email" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" value={formData.password} onChange={handleChange} type="password" required />
          </div>
          <Button className="w-full" type="submit">
            Login
          </Button>
        </div>
      </form>
    </CardContent>
  </Card>
  );
}

export default login;


